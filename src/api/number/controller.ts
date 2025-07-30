import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../middleware/logger/config";

import { validatePaginationParams } from "../../utils/pagination";
import { responseError } from "../lib";
import { getNumberFolderAggregationPaginated } from "./numberFolderAggregation";
import { getAllNumberService } from "./service";

export const getAllNumberController = async (req: Request, res: Response) => {
  const folderId = req.query.folderId;
  const isAvailable = req.query.isAvailable;
  const paginate = !req.query.paginate;
  const pagination = validatePaginationParams(req);
  if (!pagination) {
    return;
  }
  try {
    const result = await getAllNumberService({
      page: pagination.page,
      limit: pagination.limit,
      paginate,
      folderId: folderId ? Number(folderId) : 0,
      isAvailable: isAvailable,
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
      message: "Failed to fetch number",
    });
  }
};

export const getNumberFolderAggregationController = async (req: Request, res: Response) => {
  try {
    const data = await getNumberFolderAggregationPaginated(req);
    res.json({
      status: "ok",
      message: "success",
      meta: data.meta,
      result: data.result,
    });
  } catch (error) {
    responseError({ error, res });
  }
};