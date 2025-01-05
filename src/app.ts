import cookieParser from "cookie-parser";
import express, { Application } from "express";
import morgan from "morgan";
import { configDotenv } from "dotenv";
import root from "./routers/root.router";
import mongoose from "mongoose";
import auth from "./routers/auth.router";
import desk from "./routers/desk.router";

//* Create application
const app: Application = express();

//? Set middlewares and configuration
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
configDotenv();

//* Add routers
app.use("/", root);
app.use("/auth", auth);
app.use("/desk", desk);

//? Listening application
const run = async (port: string | number = process.env.PORT || 3000) => {
  await mongoose
    .connect(
      process.env.CONNECTION_STRING || "mongodb://127.0.0.1:27017/deskapiDB"
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB", err);
    });
  app.listen(port, () => {
    console.log(`App listening on ${port} 😎`);
  });
};

run();
