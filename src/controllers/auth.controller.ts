import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../models/user.model";
import * as bcrypt from "bcrypt";

export const register = async (req: Request, res: Response): Promise<void> => {
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
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Prepare response data
    const { _id, password: _, ...userData } = newUser.toObject(); // Destructure to exclude fields

    res
      .status(201)
      .json({ message: "User created successfully", data: userData });
  } catch (error: any) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
