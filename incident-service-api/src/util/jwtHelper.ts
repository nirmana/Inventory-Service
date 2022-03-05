const jwt = require("jsonwebtoken");

import { IUser } from "../models/user.model";
import { AppCodes } from "../types/enum/appCodes";
import { generateFailedResponse } from "./responseWrapper";
import IRefreshToken from "../models/refreshToken.model";
import { addDaysToDate } from "./utils";

const refreshTokenExpiryDays = parseInt(
  process.env.REFRESH_TOKEN_EXPIRY_TIME_DAYS ?? "7"
);
export const generateAccessToken = (user: IUser): string => {
  return jwt.sign(
    {
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: new Date().getTime(),
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRY_TIME_SECONDS}s` }
  );
};
export const generateRefreshToken = async (user: IUser): Promise<string> => {
  const refreshToken = jwt.sign(
    {
      email: user.email,
      name: user.name,
      createdAt: new Date().getTime(),
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRY_TIME_DAYS}d` }
  );
  const tokenStoreStatus = await IRefreshToken.create({
    email: user.email,
    refreshToken: refreshToken,
    generatedAt: new Date(),
    expiryAt: addDaysToDate(new Date(), refreshTokenExpiryDays),
    active: true,
  });
  if (tokenStoreStatus) {
    return refreshToken;
  } else {
    throw new Error("Error while storing refresh token");
  }
};
export const authenticateAccessToken = (req: any, res: any, next: any) => {
  const token = getAuthTokenFromRequest(req);
  if (!token)
    return res
      .status(400)
      .json(
        generateFailedResponse(
          "Access token is missing",
          AppCodes.INVALIDJWTTOKEN
        )
      );

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
    if (err)
      return res
        .status(401)
        .json(
          generateFailedResponse(
            "Access token is invalid",
            AppCodes.EXPIREDJWTTOKEN
          )
        );
    req.user = user;
    next();
  });
};
export const authenticateRefreshToken = (token: string): boolean => {
  if (token == null) return false;
  try {
    const user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return user && user.email ? true : false;
  } catch (err) {
    return false;
  }
};
export const getAuthTokenFromRequest = (req: any): string => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  return token;
};
