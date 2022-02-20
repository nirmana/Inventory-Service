import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  role: string;
  password: string;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      default: "User",
      enum: ["User", "Admin"],
    },
  },
  {
    collection: "users",
  }
);

export default mongoose.model<IUser>("users", UserSchema);
