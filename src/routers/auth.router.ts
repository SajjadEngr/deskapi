import { Router } from "express";
import {
  register,
  activation,
  resendActivationEmail,
  login,
} from "../controllers/auth.controller";
import { check } from "express-validator";

const auth = Router();

// Registration route
auth.post(
  "/register",
  [
    check("email")
      .isEmail()
      .withMessage("Please provide a valid email address."),
    check("password")
      .isString()
      .withMessage("Password must be a string.")
      .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
      .withMessage(
        "Password must be between 6 to 16 characters long and include at least one number and one special character."
      ),
  ],
  register
);

// Account activation route
auth.get("/activate/:token", activation);

// Resend activation email route
auth.post(
  "/resend-activation",
  [
    check("email")
      .isEmail()
      .withMessage("Please provide a valid email address."),
  ],
  resendActivationEmail
);

// Login route
auth.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please provide a valid email address."),
    check("password").isString().withMessage("Password must be a string."),
  ],
  login
);

export default auth;
