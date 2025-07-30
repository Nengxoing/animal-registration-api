import { ActionType } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { dataTokenPayload } from "../../utils/lib";
import { validatePaginationParams } from "../../utils/pagination";
import { builderOfficeRecord } from "./lib";
import {
  aggregationOfficeServices,
  createOfficeLogService,
  createOfficeService,
  editOfficeService,
  getAllOfficeService,
  getOfficeLogService,
  getOneOfficeService,
} from "./service";

export const getAllOfficeController = async (req: Request, res: Response) => {
  const pagination = validatePaginationParams(req);
  if (!pagination) {
    return;
  }

  try {
    const result = await getAllOfficeService({
      page: pagination.page,
      limit: pagination.limit,
      paginate: pagination.paginate,
      req,
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
      message: "Failed to fetch office",
    });
  }
};

export const getOfficeLogController = async (req: Request, res: Response) => {
  try {
    const result = await getOfficeLogService(req);
    res.json({
      status: "ok",
      message: "success",
      ...result,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch profile logs",
    });
  }
};

export const getOneOfficeController = async (req: Request, res: Response) => {
  try {
    const result = await getOneOfficeService({ id: Number(req.params.id) });
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

export const createOfficeController = async (req: Request, res: Response) => {
  try {
    const changedBy = dataTokenPayload(req, res)?.id;
    const transactionResult = await prisma.$transaction(async (tx) => {
      const newOffice = builderOfficeRecord(req);
      const createdOffice = await createOfficeService(newOffice, tx);
      if (!createdOffice) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "ສະຖານະເປີດໃຊ້ງານ ສາມາດເປີດໄດ້ພຽງອັນດຽວ",
        });
        return;
      }
      await createOfficeLogService({
        action: ActionType.CREATE,
        data: createdOffice as Record<string, any>,
        changedBy,
        tx,
      });
      return createdOffice;
    });
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Profile created successfully",
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

export const ediOfficeController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const changedBy = dataTokenPayload(req, res)?.id;
    const transactionResult = await prisma.$transaction(async (tx) => {
      const newOffice = { name: req.body.name, provinceId: req.body.provinceId, status: req.body.status, districtId: req.body.districtId, village: req.body.village } = req.body;
      const existingOffice = await tx.office.findUnique({ where: { id } });
      const createdOffice = await editOfficeService({ data: newOffice, id, tx });
      if (!createdOffice) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "ສະຖານະເປີດໃຊ້ງານ ສາມາດເປີດໄດ້ພຽງອັນດຽວ",
        });
        return;
      }
      await createOfficeLogService({
        action: ActionType.UPDATE,
        data: existingOffice as Record<string, any>,
        changes: createdOffice as Record<string, any>,
        changedBy,
        tx,
      });
      return createdOffice;
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Office edit successfully",
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

export const aggregationController = async (req: Request, res: Response) => {
  try {
    const aggregationResult = await aggregationOfficeServices();
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
