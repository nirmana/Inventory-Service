export interface IncidentResponse {
    incidentLog: any[];
    _id: string;
    createdAt: Date;
    incidentType: string;
    creatorId: string;
    creatorName: string;
    assigneeName: string;
    assigneeId: string;
    assignedAt?: Date;
    remarks: string;
    incidentStatus: string;
    incidentLogs: any[];
}