import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../middleware/logger/config";
import env from "../utils/env";

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
) => {
  res.status(statusCode).json({
    status: "error",
    message,
  });
};

export const sendSuccessResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any,
  // eslint-disable-next-line max-params
) => {
  res.status(statusCode).json({
    status: "success",
    message,
    ...data,
  });
};

export const responseError = ({
  error,
  res,
  message,
  statusCode,
}: {
  error?: Error | any;
  res: Response;
  statusCode?: number;
  message?: string;
}) => {
  if (error != null) {
    if (env.NODE_ENV === "development") {
    } else {
      logger.error(`Error requesting: ${error}`);
    }
  }

  let resMessage: string = "Internal Server ";
  if (message) {
    resMessage = message;
  }

  if (!message && error) {
    resMessage = error.message;
  }

  res.status(statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: resMessage,
  });
};

export const responseSuccess = ({
  res,
  body,
  message,
  statusCode,
}: {
  res: Response;
  body?: object;
  statusCode?: number;
  message?: string;
}) => {
  if (body !== null) {
    res.json({
      status: "success",
      message: message ?? "ສຳເລັດແລ້ວ",
      ...body,
    });
  } else {
    res.status(statusCode ?? StatusCodes.OK).json({
      status: "error",
      message: message ?? "ສຳເລັດແລ້ວ",
    });
  }
};

export const shouldIncludeOfficeId = (officeId: number | null): boolean => {
  return !!officeId && !isNaN(officeId) && officeId !== 0;
};

export const findRecordById = async (model: any, id: number, errorMessage?: string) => {
  try {
    const record = await model.findUnique({ where: { id } });
    if (!record) {
      throw new Error(errorMessage || "Record not found");
    }
    return record;
  } catch (error) {
    logger.error("Error finding record:", error);
    throw error;
  }
};
