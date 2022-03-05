import { IsIn, IsMongoId, IsOptional } from "class-validator";

export class UpdateIncidentRequestDto {
  @IsMongoId({ message: "Incident Id must be a valid hex ObjectId" })
  incidentId: string;
  @IsOptional({ message: "Incident Type must have a value" })
  incidentType: string;
  @IsOptional()
  assigneeId: string;
  @IsOptional()
  remarks: string;
  @IsIn(["Pending", "Acknowledged", "Resovled"])
  incidentStatus: string;

  constructor(
    incidentId: string,
    incidentType: string,
    assigneeId: string,
    remarks: string,
    incidentStatus: string
  ) {
    this.incidentId = incidentId;
    this.incidentType = incidentType;
    this.assigneeId = assigneeId;
    this.remarks = remarks;
    this.incidentStatus = incidentStatus;
  }
}
