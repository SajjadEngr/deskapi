import { Router } from "express";
import { index } from "../controllers/root.controller";

const root = Router();

root.get("", index);

export default root;
