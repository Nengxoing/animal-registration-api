import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../middleware/logger/config";
import { validatePaginationParams } from "../../utils/pagination";
import {
  aggregationPositionServices,
  createPositionService,
  editPositionService,
  getAllPositionService,
  getOnePositionService,
} from "./service";

export const getAllPositionController = async (req: Request, res: Response) => {
  const pagination = validatePaginationParams(req);
  if (!pagination) {
    return;
  }
  const { search, status, order = false } = req.query;
  try {
    const result = await getAllPositionService({
      page: pagination.page,
      limit: pagination.limit,
      order: order === "true" ? "asc" : "desc",
      paginate: pagination.paginate,
      search,
      status,
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
      message: "Failed to fetch position",
    });
  }
};

export const getOnePositionController = async (req: Request, res: Response) => {
  try {
    const result = await getOnePositionService({ id: Number(req.params.id) });
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
    const newPosition = ({
      englishName: req.body.englishName,
      laoName: req.body.laoName,
      status: req.body.status,
    } = req.body);
    const createdPosition = await createPositionService(newPosition);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Profile created successfully",
      result: createdPosition,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};

export const ediPositionController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const updatedRecord = ({ englishName: req.body.englishName } = req.body);
    const createdPosition = await editPositionService({
      data: updatedRecord,
      id,
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Position edit successfully",
      result: createdPosition,
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
    const aggregationResult = await aggregationPositionServices();
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
