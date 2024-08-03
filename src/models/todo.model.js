import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
  {
    content: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
