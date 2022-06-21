import { Router } from "express";
import { transformAndValidate } from "class-transformer-validator";

import { AppCodes } from "../../types/enum/appCodes";
import { LoginRequestDto } from "../../types/request/loginRequestDto";
import {
  formatValidationErrorMsg,
  generateFailedResponse,
  generateSuccessResponse,
} from "../../util/responseWrapper";
import { compareHash } from "../../util/utils";
import {
  authenticateAccessToken,
  authenticateRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "../../util/jwtHelper";
import { RefreshTokenRequestDto } from "../../types/request/refreshTokenRequestDto";
import IUser from "../../models/user.model";
import IRefreshToken from "../../models/refreshToken.model";

const authRouter = Router();

authRouter.post("/login", async (request: any, response: any) => {
  await transformAndValidate(LoginRequestDto, request.body)
    .then(async (loginRequest: LoginRequestDto) => {
      const user = await IUser.findOne({ email: loginRequest.userName });

      if (user && compareHash(user.password, loginRequest.password)) {
        const jwtToken = generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);
        response.status(200).send(
          generateSuccessResponse({
            accessToken: jwtToken,
            refreshToken: refreshToken,
            fullName: user.name,
          })
        );
      } else {
        return response
          .status(400)
          .json(
            generateFailedResponse(
              "Invalid Credentials",
              AppCodes.INVALIDCREDENTIALS
            )
          );
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
});

authRouter.post("/refresh-token", async (request: any, response: any) => {
  await transformAndValidate(RefreshTokenRequestDto, request.body)
    .then(async (refreshTokenRequest: RefreshTokenRequestDto) => {
      if (authenticateRefreshToken(refreshTokenRequest.refreshToken)) {
        const dbRefreshToken = await IRefreshToken.findOne({
          refreshToken: refreshTokenRequest.refreshToken,
        });
        if (
          dbRefreshToken &&
          dbRefreshToken.email &&
          dbRefreshToken.active &&
          dbRefreshToken.expiryAt >= new Date()
        ) {
          const user = await IUser.findOne({ email: dbRefreshToken.email });
          if (user) {
            const jwtToken = generateAccessToken(user);
            response.status(200).send(
              generateSuccessResponse({
                accessToken: jwtToken,
                refreshToken: dbRefreshToken.refreshToken,
                fullName: user.name,
                role: user.role,
              })
            );
          } else {
            return response
              .status(400)
              .json(
                generateFailedResponse(
                  "Invalid User",
                  AppCodes.REFRESHTOKENFAIL
                )
              );
          }
        } else {
          return response
            .status(400)
            .json(
              generateFailedResponse(
                "Refresh Token Failed",
                AppCodes.REFRESHTOKENFAIL
              )
            );
        }
      } else {
        return response
          .status(400)
          .json(
            generateFailedResponse(
              "Refresh Token JWT Validation Failed",
              AppCodes.REFRESHTOKENFAIL
            )
          );
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
});

authRouter.post(
  "/logout",
  authenticateAccessToken,
  async (request: any, response: any) => {
    const email = request.user.email;
    if (email) {
      ///can make refresh token inactive insted if needed the trace
      IRefreshToken.deleteMany(
        {
          email: email,
        },
        (err, status) => {
          if (!err) {
            response.status(200).send(generateSuccessResponse());
          } else {
            response
              .status(400)
              .send(
                generateFailedResponse(
                  "Error while logging out",
                  AppCodes.SERVERERROR
                )
              );
          }
        }
      );
    } else {
      response
        .status(400)
        .send(
          generateFailedResponse("No Refresh Token Found", AppCodes.SERVERERROR)
        );
    }
  }
);

export default authRouter;
