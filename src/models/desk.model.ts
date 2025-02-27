import { Schema, model, Document } from "mongoose";

interface IDesk extends Document {
  user: Schema.Types.ObjectId;
  title: string;
  desc?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const deskSchema = new Schema<IDesk>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, min: 4, max: 50 },
    category: String,
    desc: String,
  },
  { timestamps: true }
);

// Add unique index to ensure unique combination of user and title
deskSchema.index({ user: 1, title: 1 }, { unique: true });

const Desk = model<IDesk>("Desk", deskSchema);

export default Desk;
