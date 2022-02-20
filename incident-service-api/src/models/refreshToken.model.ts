import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshToken extends Document {
  email: string;
  refreshToken: string;
  generatedAt: Date;
  expiryAt: Date;
  active: Boolean;
}

const RefreshTokenSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    refreshToken: { type: String, required: true, unique: true },
    generatedAt: { type: Date, required: true },
    expiryAt: { type: Date, required: true },
    active: { type: Boolean, required: true, default: false },
  },
  {
    collection: "refreshTokens",
  }
);

export default mongoose.model<IRefreshToken>(
  "refreshTokens",
  RefreshTokenSchema
);
