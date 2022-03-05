import mongoose, { Schema, Document } from "mongoose";

export interface IIncidentLog extends Document {
  action: string;
  createrId: string;
  createdAt: Date;
  createrName: string;
  incidentId: string;
  incident: {} | null;
}

const IncidentLogSchema: Schema = new Schema(
  {
    createdAt: { type: Date, required: true },
    creatorId: { type: String, required: true },
    creatorName: { type: String, required: true },
    incidentId: { type: Schema.Types.ObjectId, required: true },
    incident: { type: Object, default: null },
    action: {
      type: String,
      required: true,
      default: "",
      enum: ["Delete", "Update", "CREATE"],
    },
  },
  {
    collection: "incidentLogs",
  }
);

export default mongoose.model<IIncidentLog>("incidentLogs", IncidentLogSchema);
