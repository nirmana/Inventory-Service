import { IsOptional } from "class-validator";
import { defaultPaginationObj } from "../default/defaultPaginationObj";
import { PaginationRequest } from "./paginationRequest";

export class GetIncidentRequestDto {
  @IsOptional()
  pagination: PaginationRequest;
  @IsOptional()
  incidentType: string;
  constructor(pagination: PaginationRequest, incidentType: string) {
    this.pagination = pagination ?? defaultPaginationObj;
    this.incidentType = incidentType;
  }
}
