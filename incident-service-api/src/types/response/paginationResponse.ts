import { PaginationRequest } from "../request/paginationRequest";

export class PaginationResponse<T> {
    totalRecords: number;
    data: T[];
    pagination: PaginationRequest;
    
    constructor(totalRecords: number, data: T[], pagination: PaginationRequest) {
        this.totalRecords = totalRecords;
        this.data = data;
        this.pagination = pagination;
    }
}