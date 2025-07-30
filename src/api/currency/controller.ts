import { currency } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { dataTokenPayload } from "../../utils/lib";
import logger from "../../middleware/logger/config";
import {
  createCurrencyService,
  deleteCurrencyService,
  editCurrencyService,
  getAggregationCurrencyServices,
  getAllCurrencyService,
  getOneCurrencyService,
} from "./service";

export const getAllCurrencyController = async (req: Request, res: Response) => {
  try {
    const result = await getAllCurrencyService(req);
    res.json({
      status: "ok",
      message: "success",
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
export const getOneCurrencyController = async (req: Request, res: Response) => {
  try {
    const result = await getOneCurrencyService({ id: Number(req.params.id), req });
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

export const createCurrencyController = async (req: Request, res: Response) => {
  try {
    const updatedAt = new Date();
    const officeId = dataTokenPayload(req, res)?.officeId;
    const { code, name, symbol, status } = req.body;
    const newCurrency = { code, name, symbol, status, updatedAt, officeId } as currency;
    const createdCurrency = await createCurrencyService(newCurrency);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Currency created successfully",
      result: createdCurrency,
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

export const editCurrencyController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updatedAt = new Date();
    const { code, name, symbol, status } = req.body;
    const newSymbol = symbol ? symbol : null;
    const newCurrencyRecord = { code, name, symbol: newSymbol, status, updatedAt } as currency;
    const editCurrency = await editCurrencyService({ id, currency: newCurrencyRecord });
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Currency edit successfully",
      result: editCurrency,
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

export const deleteCurrencyController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deletedAt = new Date();
    const deleteRecord  = { deletedAt } as currency;
    const deleteCurrency = await deleteCurrencyService({ id, currency: deleteRecord });
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Currency delete successfully",
      result: deleteCurrency,
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

export const getAggregationCurrencyController = async (
  req: Request,
  res: Response,
) => {
  try {
    const aggregationResult = await getAggregationCurrencyServices(req);
    res.json({
      status: "ok",
      message: "Success",
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
