import { Router } from "express";
import { register } from "../controllers/auth.controller";
import { check } from "express-validator";

const auth = Router();

auth.post(
  "/register",
  [
    check("email").isEmail(),
    check("password")
      .isString()
      .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/),
  ],
  register
);

export default auth;
