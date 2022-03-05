import mongoose, { Schema, Document } from "mongoose";

export interface IIncidentType extends Document {
  incedentTypeName: string;
}

const IncidentTypeSchema: Schema = new Schema(
  {
    incedentTypeName: { type: String, required: true, unique: true },
  },
  {
    collection: "incedentTypes",
  }
);

export default mongoose.model<IIncidentType>("incedentTypes", IncidentTypeSchema);
