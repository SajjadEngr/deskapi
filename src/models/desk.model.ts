import { Schema, model, Document } from "mongoose";

interface IDesk extends Document {
  user: Schema.Types.ObjectId;
  title?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const deskSchema = new Schema<IDesk>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    category: String,
  },
  { timestamps: true }
);

const Desk = model<IDesk>("Desk", deskSchema);

export default Desk;
