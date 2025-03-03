import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD, 
  },
});

// Send email function
export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"SocialFusion" <${process.env.MAIL_USERNAME}>`, 
      to,
      subject,
      html,
    });
    console.log(`📩 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email Error:", error);
  }
};
