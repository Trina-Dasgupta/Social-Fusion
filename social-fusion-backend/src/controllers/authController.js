import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import OTP from "../models/Otp.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import sequelize from "../../config/database.js"
import { body, validationResult } from "express-validator";
import { Op } from "sequelize";
import { generateOTP } from "../utils/generateOtp.js";
import { socialFusionEmailTemplate } from "../utils/emailTemplates.js";
import { sendEmail } from "../services/emailService.js";
import { sendEmailQueue } from "../utils/emailQueue.js";
import { verifyToken } from "../utils/verifyJwt.js";
import { addToBlacklist, isBlacklisted } from "../utils/tokenBlacklist.js";

export const register = async (req, res) => {
  await Promise.all([
    body("fullName").isLength({ min: 3 }).withMessage("Full Name must be at least 3 characters long").run(req),
    body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters long").run(req),
    body("phoneNumber").matches(/^\+?[1-9]\d{1,14}$/).withMessage("Invalid phone number format").run(req),
    body("email").isEmail().withMessage("Invalid email format").run(req),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long").run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, username, phoneNumber, email, password } = req.body;

    // Parallelized user existence check
    const [existingEmail, existingUsername, existingPhone] = await Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { username } }),
      User.findOne({ where: { phoneNumber } }),
    ]);

    if (existingEmail || existingUsername || existingPhone) {
      return res.status(400).json({ error: "Email, Username, or Phone Number already taken." });
    }

    const uploadProfilePic = req.file ? uploadToCloudinary(req.file.path) : Promise.resolve(null);
    const generateOTPAsync = generateOTP();

    const [profilePicUrl, otp] = await Promise.all([uploadProfilePic, generateOTPAsync]);

    const transaction = await sequelize.transaction();
    try {
      const users = await User.bulkCreate([{
        fullName, username, phoneNumber, email, password, profilePic: profilePicUrl, isVerified: false
      }],  { transaction, individualHooks: true });

      await OTP.bulkCreate([{ userId: users[0].id, otp }], { transaction });

      await transaction.commit();


      const otpEmail = socialFusionEmailTemplate(
        "🔐 Email Verification",
        users[0].fullName,
        `Your OTP for email verification is: <h3>${otp}</h3>. It expires in 10 minutes.`,
        "Verify Email"
      );
      sendEmail(users[0].email, "Verify Your Email", otpEmail);

      res.status(201).json({ message: "User registered. OTP sent for verification.", data: users[0] });

    } catch (error) {
      await transaction.rollback();
      console.error("❌ Registration Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

  } catch (error) {
    console.error("❌ Registration Error:", error);
    if (error.name === "SequelizeDatabaseError") {
      return res.status(500).json({ error: "Database error. Please try again later." });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required." });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otpRecord = await OTP.findOne({ where: { userId: user.id, otp } });
    if (!otpRecord) return res.status(400).json({ error: "Invalid OTP or expired" });

    user.isVerified = true;
    await user.save();

    await OTP.destroy({ where: { userId: user.id } });

    res.json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("❌ OTP Verification Error:", error);

    // ✅ Handle specific Sequelize errors
    if (error.name === "SequelizeDatabaseError") {
      return res.status(500).json({ error: "Database error. Please try again later." });
    }

    // ✅ Handle unexpected errors gracefully
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
};


export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ error: "User is already verified" });
    }

    await OTP.destroy({ where: { userId: user.id } });

    // Generate a new OTP
    const otp = generateOTP();
    await OTP.create({ userId: user.id, otp });

    const otpEmail = socialFusionEmailTemplate(
      "🔐 Resend OTP - Email Verification",
      user.fullName,
      `Your new OTP for email verification is: <h3>${otp}</h3>. It expires in 10 minutes.`,
      "Verify Email"
    );
    await sendEmail(user.email, "Verify Your Email", otpEmail);

    res.json({ message: "New OTP sent successfully." });

  } catch (error) {
    console.error("❌ Resend OTP Error:", error);
    if (error.name === "SequelizeDatabaseError") {
      return res.status(500).json({ error: "Database error. Please try again later." });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  // Input validation
  await Promise.all([
    body("identifier")
      .notEmpty()
      .withMessage("Phone, email, or username is required")
      .run(req),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { identifier, password } = req.body;

    // Find user by identifier
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { phoneNumber: identifier },
          { email: identifier },
          { username: identifier },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if account is verified
    if (!user.isVerified) {
      return res.status(403).json({ error: "Please verify your account before logging in" });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user.id);
    res.cookie("authToken", token, {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === "production",
      // sameSite: "Strict", // Prevent CSRF attacks
       sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // Return success response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        phoneNumber: user.phoneNumber,
        email: user.email,
        profilePic: user.profilePic,
      },
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    if (error.name === "SequelizeDatabaseError") {
      return res.status(500).json({ error: "Database error. Please try again later." });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    if (!req.cookies) {
      return res.status(400).json({ error: "Cookies are not enabled" });
    }

    const token = req.cookies.authToken;
    if (!token) {
      return res.status(400).json({ error: "No active session found" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    addToBlacklist(token);

    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("❌ Logout Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const userInfo = async (req, res) => {
  try {
    const token = req.cookies.authToken;

    if (!req.cookies || !req.cookies.authToken) {
      return res.status(400).json({ error: "No active session found" });
    }

    if (await isBlacklisted(token)) {
      return res.status(403).json({ error: "Token has been revoked. Please log in again." });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Fetch user from database
    const user = await User.findOne({
      where: { id: decoded.id }, // Fetch user by ID from token
      attributes: { exclude: ["password"] }, // Exclude password from response
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("❌ User Info Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

