import { Router } from "express";
import { register, login,verifyOTP,resendOTP, logout, userInfo } from "../controllers/authController.js";
import upload from "../middlewares/upload.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/register",upload.single("profilePic"), register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.get("/logout", logout);
router.get("/my-profile", authenticate,userInfo);
export default router;
