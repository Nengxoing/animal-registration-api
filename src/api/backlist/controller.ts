import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../middleware/logger/config";
import { dataTokenPayload } from "../../utils/lib";
import { createBlacklistService, getBlacklistedCompanysService, getCheckBlacklistAndExistService } from "./service";

export const getCheckBlacklistController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getCheckBlacklistAndExistService({ req });
    res.json({
      status: result.status,
      message: result.message,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch application requests",
    });
  }
};

export const getAllCompanyController = async (req: Request, res: Response) => {
  try {
    const result = await getBlacklistedCompanysService(req);
    res.json({
      status: "ok",
      message: "success",
      ...result,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch application requests",
    });
  }
};

export const createPositionController = async (req: Request, res: Response) => {
  try {
    const userId = dataTokenPayload(req, res).id;
    const newBlacklist = {
      companyId: req.body.companyId,
      reason: req.body.reason,
      status: true,
      blacklistedBy: Number(userId),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    const createdBlacklist = await createBlacklistService(newBlacklist);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Blacklist created successfully",
      result: createdBlacklist,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};

