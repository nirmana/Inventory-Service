import { IsIn, IsOptional, IsString } from "class-validator";

export class CreateIncidentRequestDto {
  @IsString({ message: "Incident Type must have a value" })
  incidentType: string;
  @IsOptional()
  assigneeId: string;
  @IsOptional()
  remarks: string;
  @IsIn(["","Pending", "Acknowledged", "Resovled"])
  incidentStatus: string;

  constructor(
    incidentType: string,
    assigneeId: string,
    remarks: string,
    incidentStatus: string
  ) {
    this.incidentType = incidentType;
    this.assigneeId = assigneeId;
    this.remarks = remarks;
    this.incidentStatus = incidentStatus;
  }
}
