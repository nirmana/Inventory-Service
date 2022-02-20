import { Router } from "express";

import IUser from "../../models/user.model";
import { UserRoleCodes } from "../../types/enum/userRoles";
import { Resource } from "../../types/enum/userAction";
import { roleBasedAuthorize } from "../../util/accessManager";
import { generateSuccessResponse } from "../../util/responseWrapper";

const userRouter = Router();

userRouter.get(
  "/assignee",
  roleBasedAuthorize(Resource.USER, "readAny"),
  async (request: any, response: any) => {
    const users = await IUser.find(
      { role: UserRoleCodes.USER },
      { password: 0, _id: 0, role: 0 }
    );
    response.status(200).send(generateSuccessResponse(users));
  }
);

export default userRouter;
