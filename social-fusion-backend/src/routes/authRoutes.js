import { Router } from "express";
import { register, login,verifyOTP,resendOTP, logout } from "../controllers/authController.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.post("/register",upload.single("profilePic"), register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.get("/logout", logout);
export default router;
