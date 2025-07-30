import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../middleware/logger/config";
import { validatePaginationParams } from "../../utils/pagination";
import {
  aggregationDistrictServices,
  createDistrictsService,
  editDistrictService,
  getAllDistrictService,
  getOneDistrictService,
} from "./service";

export const getAllDistrictController = async (req: Request, res: Response) => {
  const pagination = validatePaginationParams(req);
  if (!pagination) {
    return;
  }
  const { search, provinceId, paginate } = req.query;
  const covertedPaginate = paginate !== "false";

  try {
    const result = await getAllDistrictService({
      page: pagination.page,
      limit: pagination.limit,
      search,
      paginate: covertedPaginate,
      provinceId: provinceId ? Number(provinceId) : undefined,
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
      message: "Failed to fetch district",
    });
  }
};

export const getOneDistrictController = async (req: Request, res: Response) => {
  try {
    const result = await getOneDistrictService({ id: Number(req.params.id) });
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

export const createDistrictsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const districts = req.body;
    if (!districts || !Array.isArray(districts) || districts.length === 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Invalid input: Expected a non-empty array of districts",
        receivedData: districts,
      });
      return;
    }
    const createdDistricts = await createDistrictsService(districts);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Districts created successfully",
      result: createdDistricts,
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

export const ediDistrictController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const updatedRecord = ({
      districtLao: req.body.districtLao,
      districtEnglish: req.body.districtEnglish,
    } = req.body);
    const createdDistrict = await editDistrictService({
      data: updatedRecord,
      id,
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "District edit successfully",
      result: createdDistrict,
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
    const aggregationResult = await aggregationDistrictServices();
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
