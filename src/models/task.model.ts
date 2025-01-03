import { Schema, model, Document } from "mongoose";

interface ITask extends Document {
  desk: Schema.Types.ObjectId;
  text: string;
  dueDate: Date;
  status: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    desk: { type: Schema.Types.ObjectId, ref: "Desk", required: true },
    text: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, required: true },
    completedAt: Date,
  },
  { timestamps: true }
);

const Task = model<ITask>("Task", taskSchema);

export default Task;
