import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  activeStatus: boolean;
  tag?: string;
  resetPasswordCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tag: { type: String, required: false },
    activeStatus: { type: Boolean, required: true, default: false },
    resetPasswordCode: String,
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export default User;
