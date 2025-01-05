import { Router } from "express";
import { check } from "express-validator";
import authenticateToken from "../middlewares/auth";
import {
  addDesk,
  getDesks,
  updateDesk,
  deleteDesk,
} from "../controllers/desk.controller";

const desk = Router();

desk.post(
  "/",
  [check("title").isString().isLength({ max: 50, min: 4 }), authenticateToken],
  addDesk
);

desk.get("/", authenticateToken, getDesks);

desk.put(
  "/:id",
  [check("title").isString().isLength({ max: 50, min: 4 }), authenticateToken],
  updateDesk
);

desk.delete("/:id", authenticateToken, deleteDesk);

export default desk;
