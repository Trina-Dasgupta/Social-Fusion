import { body } from "express-validator";

export const validateRegister = [
  body("fullName")
    .isLength({ min: 3 })
    .withMessage("Full Name must be at least 3 characters long"),

  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),

  body("phoneNumber")
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage("Invalid phone number format"),

  body("email")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
