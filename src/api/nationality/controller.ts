import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../middleware/logger/config";
import { validatePaginationParams } from "../../utils/pagination";
import {
  aggregationNationalityServices,
  createNationalitysService,
  editNationalityService,
  getAllNationalityService,
  getOneNationalityService,
} from "./service";

export const getAllNationalityController = async (
  req: Request,
  res: Response,
) => {
  const pagination = validatePaginationParams(req);
  if (!pagination) {
    return;
  }
  const { search, paginate, continent = "", status, code } = req.query;
  const covertedPaginate = paginate !== "false";
  try {
    const result = await getAllNationalityService({
      page: pagination.page,
      limit: pagination.limit,
      search,
      paginate: covertedPaginate,
      continent,
      status,
      code,
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
      message: "Failed to fetch nationality",
    });
  }
};

export const getOneNationalityController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getOneNationalityService({
      id: Number(req.params.id),
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
      message: "Failed to fetch application requests",
    });
  }
};

export const createNationalitysController = async (
  req: Request,
  res: Response,
) => {
  try {
    const countries = req.body;
    if (!Array.isArray(countries) || countries.length === 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Invalid input: Expected a non-empty array of countries.",
        receivedData: countries,
      });
      return;
    }
    const createdNationalitys = await createNationalitysService(countries);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Countries created successfully.",
      result: createdNationalitys,
    });
    return;
  } catch (error) {
    logger.error("Error in createNationalitysController:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred while creating countries.",
      errorDetails: error instanceof Error ? error.message : error,
    });
  }
};

export const ediNationalityController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const updatedRecord = req.body;
    const createdNationality = await editNationalityService({
      data: updatedRecord,
      id,
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Nationality edit successfully",
      result: createdNationality,
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
    const aggregationResult = await aggregationNationalityServices();
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
