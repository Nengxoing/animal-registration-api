import { ActionType } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { responseError, responseSuccess } from "../../api/lib";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma";
import { dataTokenPayload } from "../../utils/lib";
import { validatePaginationParams } from "../../utils/pagination";
import {
  createPriceLogService,
  editPriceService,
  getAllPriceService,
  getOnePriceService,
  getPriceLogService,
  savePriceWithLogService,
} from "./service";

export const getAllPriceController = async (req: Request, res: Response) => {
  const pagination = validatePaginationParams(req);
  if (!pagination) {
    return;
  }
  const { search, status, type } = req.query;
  try {
    const result = await getAllPriceService({
      page: pagination.page,
      limit: pagination.limit,
      paginate: pagination.paginate,
      search,
      status,
      type,
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
      message: "Failed to fetch price",
    });
  }
};

export const getOnePriceController = async (req: Request, res: Response) => {
  try {
    const result = await getOnePriceService({ id: Number(req.params.id) });
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

export const createPriceController = async (req: Request, res: Response) => {
  try {
    const payload = dataTokenPayload(req, res);
    const { name, price, status, type, code, duration } = req.body;
    const newPrice = {
      name,
      price,
      status,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      code: code,
      duration,
    };
    const newPriceLog = {
      priceId: undefined,
      action: ActionType.CREATE,
      changedBy: payload.id,
      oldPrice: null,
      newPrice: price,
      oldName: null,
      newName: name,
    };
    await savePriceWithLogService(newPrice, newPriceLog);
    responseSuccess({ res, message: "Price created successfully" });
  } catch {
    responseError({ res });
  }
};

export const ediPriceController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const changedBy = dataTokenPayload(req, res)?.id;
  try {
    const transactionResult = await prisma.$transaction(async (tx) => {
      const newPrice = req.body;
      const oldexistingPrices = await tx.price.findUnique({ where: { id } });
      const createdPrice = await editPriceService({ data: newPrice, id, tx });
      if (!createdPrice) {
        throw Error;
      }
      await createPriceLogService({
        action: ActionType.UPDATE,
        data: oldexistingPrices as Record<string, any>,
        changes: createdPrice as Record<string, any>,
        changedBy,
        tx,
      });
      return createdPrice;
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Price edit successfully",
      result: transactionResult,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "ສະຖານະເປີດໃຊ້ງານ ສາມາດເປີດໄດ້ພຽງອັນດຽວ ຫຼື ລະບົບມີບັນຫາ",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const getPriceLogController = async (req: Request, res: Response) => {
  try {
    const result = await getPriceLogService(req);
    res.json({
      status: "ok",
      message: "success",
      ...result,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch Price log",
    });
  }
};
