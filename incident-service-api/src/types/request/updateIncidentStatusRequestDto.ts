import { IsIn, IsMongoId } from "class-validator";

export class UpdateIncidentStatusRequestDto {
  @IsMongoId({ message: "Incident Id must be a valid hex ObjectId" })
  incidentId: string;
  @IsIn(["Acknowledged", "Resovled"])
  incidentStatus: string;

  constructor(incidentId: string, incidentStatus: string) {
    this.incidentId = incidentId;
    this.incidentStatus = incidentStatus;
  }
}
