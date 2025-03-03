import { Router } from "express";
import { register, login,verifyOTP } from "../controllers/authController.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.post("/register",upload.single("profilePic"), register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);

export default router;
