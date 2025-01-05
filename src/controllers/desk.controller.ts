import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import Desk from "../models/desk.model";

export const addDesk = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const { title, category, desc } = req.body;
    const newDesk = await Desk.create({ title, category, desc, user: user.id });
    await newDesk.save();
    res.json({
      message: "Desk created successfully",
      data: {
        title: newDesk.title,
        category: newDesk.category,
        desc: newDesk.desc,
        createdAt: newDesk.createdAt,
      },
    });
    return;
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Internal error" });
    return;
  }
};

export const getDesks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const desks = await Desk.find({ user: req.user.id });
    res.json({ data: desks });
    return;
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Internal error" });
    return;
  }
};

export const updateDesk = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, desc } = req.body;
    const updatedDesk = await Desk.findByIdAndUpdate(
      id,
      { title, category, desc },
      { new: true }
    );
    if (!updatedDesk) {
      res.status(404).json({ message: "Desk not found" });
      return;
    }
    res.json({
      message: "Desk updated successfully",
      data: updatedDesk,
    });
    return;
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Internal error" });
    return;
  }
};

export const deleteDesk = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deletedDesk = await Desk.findByIdAndDelete(id);
    if (!deletedDesk) {
      res.status(404).json({ message: "Desk not found" });
      return;
    }
    res.json({ message: "Desk deleted successfully" });
    return;
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ message: "Internal error" });
    return;
  }
};
