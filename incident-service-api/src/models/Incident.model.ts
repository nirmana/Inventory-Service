import mongoose, { Schema, Document } from "mongoose";

export interface IIncident extends Document {
  incidentType: string;
  createrId: string;
  createdAt: Date;
  assigneeName: string;
  assigneeId: string;
  assignedAt: Date;
  remarks: string;
  createrName: string;
  incidentStatus: string;
}

const IncidentSchema: Schema = new Schema(
  {
    createdAt: { type: Date, required: true },
    incidentType: { type: String, required: true },
    creatorId: { type: String, required: true },
    creatorName: { type: String, required: true },
    assigneeName: { type: String, required: false },
    assigneeId: { type: String, required: false },
    assignedAt: { type: Date, required: false },
    remarks: { type: String, required: false },
    incidentStatus: {
      type: String,
      required: true,
      default: "Pending",
      enum: ["Pending", "Acknowledged", "Resovled"],
    },
    incidentLog: { type: Array, required: false, default: [] },
  },
  {
    collection: "incidents",
  }
);

export default mongoose.model<IIncident>("incidents", IncidentSchema);
