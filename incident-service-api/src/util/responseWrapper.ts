import { ValidationError } from "class-validator";

import { AppCodes } from "../types/enum/appCodes";
import { ApiResponseDto } from "../types/response/apiResponseDto";

export const generateFailedResponse = (
  msg: string | undefined,
  code: AppCodes
): ApiResponseDto<any> => {
  return {
    message: msg ?? "Request Failed",
    status: code,
    data: null,
  };
};

export const generateSuccessResponse = (
  data: any | undefined = {},
  msg: string | undefined = ""
): ApiResponseDto<any> => {
  return {
    message: msg ?? "",
    status: AppCodes.SUCCESS,
    data: data,
  };
};

export const formatValidationErrorMsg = (
  error: ValidationError | ValidationError[]
): string => {
  if (Array.isArray(error)) {
    return error.reduce((acc: string, e: any) => {
      return (
        acc + Object.keys(e.constraints).map((k) => e.constraints[k]) + "\n"
      );
    }, "");
  } else {
    return (error.constraints && error.constraints[0]) ?? "";
  }
};
