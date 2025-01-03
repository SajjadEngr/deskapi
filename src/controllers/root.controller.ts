import { Request, Response } from "express";

export const index = async (req: Request, res: Response) => {
  try {
    res.json({ message: "Welcome to DeskApi 😊" }).status(200);
  } catch (error: any) {
    console.log(error.message);
    res.json({ message: "Internal Server Error" }).status(500);
  }
};
