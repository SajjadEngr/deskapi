// Import necessary modules
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/user.model";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendActivationEmail } from "../utils/email";

// Register function
export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;
  try {
    // Check if user already exists
    const userExist = await User.findOne({ email }).lean();
    if (userExist) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Create and save new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      activeStatus: false,
    });
    await newUser.save();

    // Generate JWT for the user
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.SECRET_KEY || "my-secret"
    );

    // Create activation token
    const activationToken = jwt.sign(
      { userId: newUser.id },
      process.env.SECRET_KEY || "my-secret",
      { expiresIn: "1d" } // Activation token valid for 1 day
    );

    await newUser.updateOne({ activationToken });

    // Send activation email
    const activationLink = `http://localhost:3000/auth/activate/${activationToken}`;
    await sendActivationEmail(newUser.email, activationLink);

    res.status(201).json({
      message:
        "User created successfully. Please check your email to activate your account.",
      token,
    });
  } catch (error: any) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Activation function
export const activation = async (req: Request, res: Response) => {
  const { token } = req.params;
  try {
    const decoded: any = jwt.verify(
      token,
      process.env.SECRET_KEY || "my-secret"
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    // Check if user is already activated
    if (user.activeStatus) {
      res.status(400).json({ message: "Account already activated" });
      return;
    }

    user.activeStatus = true; // Activate user account
    await user.save();

    res.status(200).json({ message: "Account activated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Resend activation email function
export const resendActivationEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email }).lean();

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    if (user.activeStatus) {
      res.status(400).json({ message: "Account already activated" });
      return;
    }

    // Create a new activation token
    const activationToken = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY || "my-secret",
      { expiresIn: "1d" }
    );

    await User.updateOne({ _id: user._id }, { activationToken });

    // Send the activation email again
    const activationLink = `http://localhost:3000/auth/activate/${activationToken}`;
    await sendActivationEmail(user.email, activationLink);

    res.status(200).json({
      message: "Activation email resent. Please check your inbox.",
    });
  } catch (error: any) {
    console.error("Error while resending activation email:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login function
export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    // Check if user exists and is activated
    const user = await User.findOne({ email }).lean();

    if (!user || !user.activeStatus) {
      res
        .status(400)
        .json({ message: "Invalid credentials or account not activated." });
      return;
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT for the logged-in user
    const token = jwt.sign(
      { id: user._id, email },
      process.env.SECRET_KEY || "my-secret"
    );

    res.status(200).json({
      message: "Login successful",
      token,
      data: { id: user._id, email },
    });
  } catch (error: any) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
