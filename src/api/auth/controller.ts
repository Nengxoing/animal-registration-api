import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";

import logger from "../../middleware/logger/config";

import { sendErrorResponse, sendSuccessResponse } from "../../api/lib";
import { buildPayload, getUserByUsername, validatePassword } from "./lib";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user || !user.isActive) {
      return sendErrorResponse(
        res,
        StatusCodes.NOT_FOUND,
        "ຊື່ຜູ້ໃຊ້ງາ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ",
      );
    }
    const isPasswordValid = validatePassword(password, user.password);
    if (!isPasswordValid) {
      return sendErrorResponse(
        res,
        StatusCodes.NOT_FOUND,
        "ຊື່ຜູ້ໃຊ້ງາ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ",
      );
    }
    const payload = buildPayload(user);
    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);
    if (!accessToken) {
      return sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to generate access token",
      );
    }
    return sendSuccessResponse(
      res,
      StatusCodes.OK,
      "You have been authenticated",
      {
        user: payload,
        accessToken,
        refreshToken,
      },
    );
  } catch (error) {
    logger.error(error);
    return sendErrorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Authentication failed",
    );
  }
};
