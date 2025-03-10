import { Router } from "express";
import { register, login,verifyOTP,resendOTP, logout, userInfo } from "../controllers/authController.js";
import { uploadSingle } from "../middlewares/upload.js";
import { authenticate } from "../middlewares/auth.js";
import { validateRegister } from "../validators/authValidator.js";

const router = Router();

router.post("/register", uploadSingle("profilePic"),validateRegister, register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.get("/logout", logout);
router.get("/my-profile", authenticate,userInfo);
export default router;
