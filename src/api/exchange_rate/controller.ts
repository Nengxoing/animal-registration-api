import { exchangeRate } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { dataTokenPayload } from "../../utils/lib";
import logger from "../../middleware/logger/config";
import { buildExchangeRateCreateRecord } from "./lib";
import {
  createExchangeRateService,
  deleteExchangeRateService,
  editExchangeRateService,
  getAggregationExchangeRateServices,
  getAllExchangeRateService,
  getOneExchangeRateService,
} from "./service";

export const getAllExchangeRateController = async (req: Request, res: Response) => {
  try {
    const result = await getAllExchangeRateService(req);
    res.json({
      status: "ok",
      ...result,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch folder",
    });
  }
};
export const getOneExchangeRateController = async (req: Request, res: Response) => {
  try {
    const result = await getOneExchangeRateService({ id: Number(req.params.id), req });
    res.json({
      status: "ok",
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

export const createExchangeRateController = async (req: Request, res: Response) => {
  try {
    const exchangeRateRecord = buildExchangeRateCreateRecord(req);
    const officeId = dataTokenPayload(req, res)?.officeId;
    const convertOfficeId  = parseInt(officeId);
    const newRecord = { ...exchangeRateRecord, officeId: convertOfficeId, deletedAt: null } as unknown as exchangeRate;
    const createdExchangeRate = await createExchangeRateService(newRecord);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "ExchangeRate created successfully",
      result: createdExchangeRate,
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

export const editExchangeRateController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const officeId = dataTokenPayload(req, res)?.officeId;
    const convertOfficeId  = parseInt(officeId);
    const updatedAt = new Date();
    const exchangeRateRecord = buildExchangeRateCreateRecord(req);
    const newRecord = { ...exchangeRateRecord, updatedAt, officeId: convertOfficeId } as unknown as exchangeRate;
    const editExchangeRate = await editExchangeRateService({ id, exchangeRate: newRecord });
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "ExchangeRate edit successfully",
      result: editExchangeRate,
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

export const deleteExchangeRateController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deletedAt = new Date();
    const deleteRecord  = { deletedAt } as exchangeRate;
    const deleteExchangeRate = await deleteExchangeRateService({ id, exchangeRate: deleteRecord });
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "ExchangeRate delete successfully",
      result: deleteExchangeRate,
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

export const getAggregationExchangeRateController = async (
  req: Request,
  res: Response,
) => {
  try {
    const aggregationResult = await getAggregationExchangeRateServices(req);
    res.json({
      status: "ok",
      ...aggregationResult,
    });
    return;
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred while fetching user aggregation.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return;
  }
};
