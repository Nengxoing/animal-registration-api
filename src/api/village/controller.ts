import { village } from "@prisma/client";
import { Request, Response } from "express";

import { StatusCodes } from "http-status-codes";
import logger from "../../middleware/logger/config";
import { validatePaginationParams } from "../../utils/pagination";
import {
  aggregationVillageServices,
  createVillagesService,
  editVillageService,
  getAllVillageService,
  getOneVillageService,
} from "./service";

export const getAllVillageController = async (req: Request, res: Response) => {
  const pagination = validatePaginationParams(req);
  if (!pagination) {
    return;
  }
  const { search, districtId } = req.query;
  try {
    const result = await getAllVillageService({
      page: pagination.page,
      limit: pagination.limit,
      search,
      paginate: pagination.paginate,
      districtId: districtId ? Number(districtId) : undefined,
    });
    res.json({
      status: "ok",
      message: "success",
      ...result,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch village",
    });
  }
};

export const getOneVillageController = async (req: Request, res: Response) => {
  try {
    const result = await getOneVillageService({ id: Number(req.params.id) });
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

export const createVillagesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { villageLao, villageEnglish, districtId, status } = req.body;
    const newVillage = { villageLao, villageEnglish, districtId, status } as village;
    const createdVillages = await createVillagesService(newVillage);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Villages created successfully",
      result: createdVillages,
    });
    return;
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred",
      errorDetails: error instanceof Error ? error.message : error,
    });
  }
};

export const ediVillageController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const updatedRecord = ({
      villageLao: req.body.villageLao,
      villageEnglish: req.body.villageEnglish,
    } = req.body);
    const createdVillage = await editVillageService({
      data: updatedRecord,
      id,
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Village edit successfully",
      result: createdVillage,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};

export const aggregationController = async (req: Request, res: Response) => {
  try {
    const aggregationResult = await aggregationVillageServices();
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Aggregation successful",
      result: aggregationResult,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred while fetching user aggregation.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
