import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../middleware/logger/config";
import { validatePaginationParams } from "../../utils/pagination";
import {
  aggregationProvinceServices,
  createProvincesService,
  editProvinceService,
  getAllProvinceService,
  getOneProvinceService,
} from "./service";

export const getAllProvinceController = async (req: Request, res: Response) => {
  const pagination = validatePaginationParams(req);
  if (!pagination) {
    return;
  }
  const { search } = req.query;
  try {
    const result = await getAllProvinceService({
      page: pagination.page,
      limit: pagination.limit,
      paginate: pagination.paginate,
      search,
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
      message: "Failed to fetch province",
    });
  }
};

export const getOneProvinceController = async (req: Request, res: Response) => {
  try {
    const result = await getOneProvinceService({ id: Number(req.params.id) });
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

export const createProvincesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const provinces = req.body;
    if (!provinces || !Array.isArray(provinces) || provinces.length === 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Invalid input: Expected a non-empty array of provinces",
        receivedData: provinces,
      });
      return;
    }
    const createdProvinces = await createProvincesService(provinces);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Provinces created successfully",
      result: createdProvinces,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred",
      errorDetails: error instanceof Error ? error.message : error,
    });
  }
};

export const ediProvinceController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const updatedRecord = {
      provinceEnglish: req.body.englishName,
      provinceLao: req.body.name,
      status: req.body.status,
    };
    const createdProvince = await editProvinceService({
      data: updatedRecord,
      id,
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Province edit successfully",
      result: createdProvince,
    });
  } catch {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};

export const aggregationController = async (req: Request, res: Response) => {
  try {
    const aggregationResult = await aggregationProvinceServices();
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
