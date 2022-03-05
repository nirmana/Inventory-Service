import { Router } from "express";

import { UserRoleCodes } from "../../types/enum/userRoles";
import { Resource } from "../../types/enum/userAction";
import { roleBasedAuthorize } from "../../util/accessManager";
import {
  formatValidationErrorMsg,
  generateFailedResponse,
  generateSuccessResponse,
} from "../../util/responseWrapper";
import IIncident from "../../models/incident.model";
import IUser from "../../models/user.model";
import IIncidentType from "../../models/incidentType.model";
import IIncidentLog from "../../models/incidentLog.model";
import { transformAndValidate } from "class-transformer-validator";
import { GetIncidentRequestDto } from "../../types/request/getIncidentRequestDto";
import { PaginationResponse } from "../../types/response/paginationResponse";
import { SortKeys } from "../../types/enum/sortKey";
import { CreateIncidentRequestDto } from "../../types/request/createIncidentRequestDto";
import { AppCodes } from "../../types/enum/appCodes";
import { getDate } from "../../util/utils";
import { DeleteIncidentRequestDto } from "../../types/request/DeleteIncidentRequestDto";
import { UpdateIncidentRequestDto } from "../../types/request/updateIncidentRequestDto";
import { UpdateIncidentStatusRequestDto } from "../../types/request/updateIncidentStatusRequestDto";

const incidentRouter = Router();

incidentRouter.get(
  "/",
  roleBasedAuthorize(Resource.INCIDENT, "readAny"),
  async (request: any, response: any) => {
    await transformAndValidate(GetIncidentRequestDto, request.query)
      .then(async (incidentRequest: GetIncidentRequestDto) => {
        const filter = {},
          sort = {};
        ///user filter
        if (request.user.role === UserRoleCodes.USER) {
          filter["assigneeId"] = request.user.id;
        }
        ///search
        incidentRequest.pagination?.searchQueries?.forEach(
          (searchItem: any) => {
            filter[searchItem.searchKey] = {
              $regex: searchItem.searchPhrase,
              $options: "i",
            };
          }
        );
        ///sort
        if (incidentRequest.pagination?.sortKey)
          sort[incidentRequest.pagination.sortKey] =
            incidentRequest.pagination?.sortOrder === SortKeys.SASC
              ? SortKeys.ASC
              : SortKeys.DESC;

        const totalRecords = await IIncident.count(filter);
        const incidents = await IIncident.find(filter)
          .sort(sort)
          .skip(
            incidentRequest.pagination.pageSize *
              (incidentRequest.pagination.page - 1)
          )
          .limit(incidentRequest.pagination.pageSize);

        const incidentPage: PaginationResponse<any> = {
          totalRecords: totalRecords,
          data: incidents,
          pagination: incidentRequest.pagination,
        };
        response.status(200).send(generateSuccessResponse(incidentPage));
      })
      .catch((err) => {
        response
          .status(400)
          .json(
            generateFailedResponse(
              formatValidationErrorMsg(err),
              AppCodes.VALIDATIONFAILED
            )
          );
      });
  }
);

incidentRouter.post(
  "/",
  roleBasedAuthorize(Resource.INCIDENT, "createAny"),
  async (request: any, response: any) => {
    await transformAndValidate(CreateIncidentRequestDto, request.body)
      .then(async (incidentRequest: CreateIncidentRequestDto) => {
        /// validate assignee & incident type
        const assignee = incidentRequest.assigneeId
          ? await IUser.findOne({ email: incidentRequest.assigneeId })
          : null;

        const incidentType = await IIncidentType.findOne({
          incedentTypeName: incidentRequest.incidentType,
        });
        if (incidentRequest.incidentType !== "" && !incidentType) {
          return response
            .status(400)
            .json(
              generateFailedResponse(
                "Invalid incident type",
                AppCodes.VALIDATIONFAILED
              )
            );
        } else {
          const incidentCreationStatus = await IIncident.create({
            createdAt: getDate(),
            incidentType: incidentRequest.incidentType,
            creatorId: request.user.email,
            creatorName: request.user.name,
            assigneeId: assignee?.email ?? null,
            assigneeName: assignee?.name ?? null,
            assignedAt: assignee ? getDate() : null,
            remarks: incidentRequest.remarks,
            incidentStatus:
              incidentRequest.incidentType === ""
                ? "Pending"
                : incidentRequest.incidentStatus,
          });
          if (incidentCreationStatus) {
            try {
              await IIncidentLog.create({
                incidentId: incidentCreationStatus._id,
                createdAt: getDate(),
                creatorId: request.user.email,
                creatorName: request.user.name,
                incident: incidentCreationStatus,
                action: "CREATE",
              });
            } finally {
              return response
                .status(200)
                .send(generateSuccessResponse(incidentCreationStatus));
            }
          } else {
            return response
              .status(500)
              .send(
                generateFailedResponse(
                  "Failed to create incident",
                  AppCodes.SERVERERROR
                )
              );
          }
        }
      })
      .catch((err) => {
        console.log(err);
        response
          .status(400)
          .json(
            generateFailedResponse(
              formatValidationErrorMsg(err),
              AppCodes.VALIDATIONFAILED
            )
          );
      });
  }
);

incidentRouter.delete(
  "/",
  roleBasedAuthorize(Resource.INCIDENT, "deleteAny"),
  async (request: any, response: any) => {
    await transformAndValidate(DeleteIncidentRequestDto, request.query)
      .then(async (deleteIncidentRequest: DeleteIncidentRequestDto) => {
        /// todo: implement transaction
        const incident = await IIncident.findOne({
          _id: deleteIncidentRequest.incidentId,
        });
        if (incident) {
          await IIncident.deleteOne({ _id: deleteIncidentRequest.incidentId });
          await IIncidentLog.create({
            incidentId: incident._id,
            createdAt: getDate(),
            creatorId: request.user.email,
            creatorName: request.user.name,
            incident: incident,
            action: "Delete",
          });
          return response
            .status(200)
            .send(generateSuccessResponse("Incident deleted successfully"));
        } else {
          return response
            .status(400)
            .send(generateFailedResponse("No Incident Found", AppCodes.NODATA));
        }
      })
      .catch((err) => {
        response
          .status(400)
          .json(
            generateFailedResponse(
              formatValidationErrorMsg(err),
              AppCodes.VALIDATIONFAILED
            )
          );
      });
  }
);

incidentRouter.put(
  "/",
  roleBasedAuthorize(Resource.INCIDENT, "updateAny"),
  async (request: any, response: any) => {
    await transformAndValidate(UpdateIncidentRequestDto, request.body)
      .then(async (updateIncidentRequest: UpdateIncidentRequestDto) => {
        /// validate incident id
        const incident = await IIncident.findOne({
          _id: updateIncidentRequest.incidentId,
        });
        if (updateIncidentRequest.incidentType !== "" && !incident)
          return response
            .status(400)
            .send(generateFailedResponse("No Incident Found", AppCodes.NODATA));
        /// validate assignee & incident type
        const assignee = updateIncidentRequest.assigneeId
          ? await IUser.findOne({ email: updateIncidentRequest.assigneeId })
          : null;
        const incidentType = await IIncidentType.findOne({
          incedentTypeName: updateIncidentRequest.incidentType,
        });
        if (!incidentType) {
          return response
            .status(400)
            .json(
              generateFailedResponse(
                "Invalid incident type",
                AppCodes.VALIDATIONFAILED
              )
            );
        } else {
          const incidentUpdateStatus = await IIncident.updateOne(
            { _id: updateIncidentRequest.incidentId },
            {
              incidentType: incidentType.incedentTypeName,
              assigneeId: assignee?.email ?? null,
              assigneeName: assignee?.name ?? null,
              assignedAt: assignee ? getDate() : null,
              remarks: updateIncidentRequest.remarks,
              incidentStatus:
                updateIncidentRequest.incidentType === ""
                  ? "Pending"
                  : updateIncidentRequest.incidentStatus,
            }
          );

          if (
            incidentUpdateStatus &&
            incidentUpdateStatus.acknowledged &&
            incidentUpdateStatus.modifiedCount > 0
          ) {
            try {
              await IIncidentLog.create({
                incidentId: incident._id,
                createdAt: getDate(),
                creatorId: request.user.email,
                creatorName: request.user.name,
                incident: incident,
                action: "Update",
              });
            } finally {
              return response
                .status(200)
                .send(
                  generateSuccessResponse(incidentUpdateStatus.acknowledged)
                );
            }
          } else if (
            incidentUpdateStatus &&
            incidentUpdateStatus.acknowledged &&
            incidentUpdateStatus.modifiedCount === 0
          ) {
            return response.status(204).send();
          } else {
            return response
              .status(500)
              .send(
                generateFailedResponse(
                  "Failed to create incident",
                  AppCodes.SERVERERROR
                )
              );
          }
        }
      })
      .catch((err) => {
        console.log(err);
        response
          .status(400)
          .json(
            generateFailedResponse(
              formatValidationErrorMsg(err),
              AppCodes.VALIDATIONFAILED
            )
          );
      });
  }
);

incidentRouter.put(
  "/update-status",
  roleBasedAuthorize(Resource.INCIDENT, "updateOwn"),
  async (request: any, response: any) => {
    await transformAndValidate(UpdateIncidentStatusRequestDto, request.body)
      .then(
        async (updateIncidentStatusRequest: UpdateIncidentStatusRequestDto) => {
          /// validate incident id
          const incident = await IIncident.findOne({
            _id: updateIncidentStatusRequest.incidentId,
            assigneeId: request.user.email,
          });
          if (!incident)
            return response
              .status(400)
              .send(
                generateFailedResponse("Incident not found", AppCodes.NODATA)
              );
          const incidentStatusChange = await IIncident.updateOne(
            { _id: updateIncidentStatusRequest.incidentId },
            {
              incidentStatus: updateIncidentStatusRequest.incidentStatus,
            }
          );

          if (
            incidentStatusChange &&
            incidentStatusChange.acknowledged &&
            incidentStatusChange.modifiedCount > 0
          ) {
            try {
              await IIncidentLog.create({
                incidentId: incident._id,
                createdAt: getDate(),
                creatorId: request.user.email,
                creatorName: request.user.name,
                incident: incident,
                action: "Update",
              });
            } finally {
              return response
                .status(200)
                .send(
                  generateSuccessResponse(incidentStatusChange.acknowledged)
                );
            }
          } else if (
            incidentStatusChange &&
            incidentStatusChange.acknowledged &&
            incidentStatusChange.modifiedCount === 0
          ) {
            return response.status(204).send();
          } else {
            return response
              .status(500)
              .send(
                generateFailedResponse(
                  "Failed to update incident",
                  AppCodes.SERVERERROR
                )
              );
          }
        }
      )
      .catch((err) => {
        response
          .status(400)
          .json(
            generateFailedResponse(
              formatValidationErrorMsg(err),
              AppCodes.VALIDATIONFAILED
            )
          );
      });
  }
);

export default incidentRouter;
