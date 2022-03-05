import { IsMongoId } from "class-validator";

export class DeleteIncidentRequestDto {
  @IsMongoId({ message: "Incident Id must be a valid hex ObjectId" })
  incidentId: string;
  constructor(incidentId: string) {
    this.incidentId = incidentId;
  }
}
