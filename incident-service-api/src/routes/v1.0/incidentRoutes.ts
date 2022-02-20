import { Router } from "express";

import IUser from "../../models/user.model";
import { UserRoleCodes } from "../../types/enum/userRoles";
import { Resource } from "../../types/enum/userAction";
import { roleBasedAuthorize } from "../../util/accessManager";
import { generateSuccessResponse } from "../../util/responseWrapper";

const incidentRouter = Router();

incidentRouter.get(
  "/",
  roleBasedAuthorize(Resource.INCIDENT, "readAny"),
  async (request: any, response: any) => {
    
  }
);

export default incidentRouter;
