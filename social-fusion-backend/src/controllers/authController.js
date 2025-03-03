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

  const transaction = await sequelize.transaction();

  try {
    console.log("📩 Register API Called");

    const { fullName, username, phoneNumber, email, password } = req.body;

    const existingUser = await User.findOne({
      where: { 
        [Op.or]: [{ email }, { username }, { phoneNumber }] 
      },
      transaction,
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email, Username, or Phone Number already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let profilePicUrl = req.file ? await uploadToCloudinary(req.file.path) : null;

    const user = await User.create(
      {
        fullName,
        username,
        phoneNumber,
        email,
        password: hashedPassword,
        profilePic: profilePicUrl,
        isVerified: false,
      },
      { transaction }
    );

    const otp = generateOTP();
    await OTP.create({ userId: user.id, otp }, { transaction });

    const otpEmail = socialFusionEmailTemplate(
      "🔐 Email Verification",
      user.fullName,
      `Your OTP for email verification is: <h3>${otp}</h3>. It expires in 10 minutes.`,
      "Verify Email",
      `${process.env.SITE_URL}/verify-email?otp=${otp}&email=${user.email}`
    );
    await sendEmail(user.email, "Verify Your Email", otpEmail);

    await transaction.commit();

    res.status(201).json({ message: "User registered. OTP sent for verification.", token: generateToken(user.id) });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    await transaction.rollback();
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

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
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ where: { phone } });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({ user, token: generateToken(user.id) });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};
