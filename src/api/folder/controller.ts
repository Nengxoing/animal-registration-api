/* eslint-disable max-lines */

/* eslint-disable max-nested-callbacks */
import { ActionType, processStatus } from "@prisma/client";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { dataTokenPayload } from "../../utils/lib";
import { responseError, responseSuccess } from "../lib";
import {
  builderFolderRecord,
  classifyError,
  getErrorResponse,
} from "./lib";
import {
  aggregationFolderServices,
  createFolderLogService,
  exportAnimalService,
  folderRejectService,
  generateFolderCode,
  getAllAnimalExportService,
  getAllFolderService,
  getFolderLogService,
  getOneFolderService,
  statusFolderService,
} from "./service";
import { AnimalExportPayload } from "./type";

export const createAnimalExportController = async (req: Request, res: Response) => {
  try {
    const payload: AnimalExportPayload = req.body;
    const result = await exportAnimalService(payload);
    return responseSuccess({
      res: res,
      statusCode: StatusCodes.OK,
      message: "ສົ່ງອອກສັດສຳເລັດ",
      body: result,
    });
  } catch (error: any) {
    logger.error(`Error in createAnimalExportController: ${error.message}`);
    return responseError({
      res: res,
      statusCode: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || "ເກີດຂໍ້ຜິດພາດໃນການສົ່ງອອກສັດ",
      error: error,
    });
  } finally {
  }
};

export const getAllAnimalExportController = async (req: Request, res: Response) => {
  try {
    const result = await getAllAnimalExportService(req);
    return responseSuccess({
      res: res,
      statusCode: StatusCodes.OK,
      message: "ດຶງຂໍ້ມູນການສົ່ງອອກສັດສຳເລັດ",
      body: result,
    });
  } catch (error: any) {
    logger.error(`Error in getAllAnimalExportController: ${error.message}`);
    return responseError({
      res: res,
      statusCode: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: error.message || "ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນການສົ່ງອອກສັດ",
      error: error,
    });
  }
};

export const getAllFolderController = async (req: Request, res: Response) => {
  try {
    const result = await getAllFolderService(req);
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
  } finally {
    await prisma.$disconnect();
  }
};
export const getFolderLogController = async (req: Request, res: Response) => {
  try {
    const result = await getFolderLogService(req);
    res.json({
      status: "ok",
      message: "success",
      ...result,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch folder log",
    });
  }
};
export const getOneFolderController = async (req: Request, res: Response) => {
  try {
    const result = await getOneFolderService(req);
    res.json({
      status: "ok",
      message: "success",
      result: {
        ...result,
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch application requests",
    });
  }
};

export const createFolderRejectController = async (req: Request, res: Response) => {
  try {
    const { comment, folderId } = req.body;
    const newFolderReject = {
      comment,
      folderId,
      status: processStatus.REJECTED,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    await folderRejectService(newFolderReject);
    responseSuccess({ res, message: "Folder Reject created successfully" });
  } catch {
    responseError({ res });
  }
};

export const createFolderController = async (req: Request, res: Response) => {
  try {
    const { officeId, id: changedBy } = dataTokenPayload(req, res);
    if (!officeId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Office not found",
      });
      return;
    }
    await prisma.$transaction(async (tx) => {
      const officeExists = await tx.office.findUnique({ where: { id: officeId } });
      if (!officeExists) {
        res.status(StatusCodes.BAD_REQUEST).json({ status: "error", message: "Invalid officeId" });
        return;
      }
      const folderData = req.body;
      const extractPriceId = (price: { priceId: number }) => price.priceId;
      const priceIds = folderData.folderPrice.map(extractPriceId);
      const priceData = await tx.price.findMany({ where: { id: { in: priceIds } } });
      if (priceData.length !== priceIds.length) {
        res.status(StatusCodes.BAD_REQUEST).json({ status: "error", message: "Invalid priceId" });
        return;
      }
      const code = await generateFolderCode({ officeId, tx });
      const folderRecord = {
        ...builderFolderRecord({ folder: folderData, code, officeId, changedBy, priceData }),
        createdAt: new Date(),
        updatedAt: new Date(),
        billDate: req.body.billDate ? new Date(req.body.billDate) : null,
        deletedAt: null,
      };
      const createdFolder = await tx.folder.create({ data: folderRecord });
      return createdFolder;
    });
    res.status(StatusCodes.OK).json({ status: "Success", message: "Folder created successfully" });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  } finally {
    await prisma.$disconnect();
  }
};
export const editFolderController = async (req: Request, res: Response) => {
  try {
    const { id: folderId } = req.params;
    if (!folderId || isNaN(Number(folderId))) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Invalid or missing folderId",
      });
      return;
    }
    const { id: changedBy } = dataTokenPayload(req, res);
    const folderData = req.body;
    const priceIds = folderData.folderPrice.map((p: { priceId: number }) => p.priceId);
    const priceData = await prisma.price.findMany({
      where: { id: { in: priceIds } },
    });
    if (priceData.length !== priceIds.length) {
      res.status(StatusCodes.BAD_REQUEST).json({ status: "error", message: "Invalid price ID provided" });
      return;
    }
    const existingFolder = await prisma.folder.findUnique({
      where: { id: Number(folderId) },
      include: { folderPrice: true },
    });
    if (!existingFolder) {
      res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "Folder not found",
      });
      return;
    }

    await prisma.$transaction(async (tx) => {
      const existingPriceIds = existingFolder.folderPrice.map((fp) => fp.id);
      await tx.folderPriceLog.deleteMany({
        where: { folderPriceId: { in: existingPriceIds } },
      });
      await tx.folderPrice.deleteMany({
        where: { folderId: Number(folderId) },
      });
      const newPrices = folderData.folderPrice.map((price: { priceId: number; amount: number }) => {
        const priceInfo = priceData.find((p) => p.id === price.priceId);
        return {
          amount: Number(price.amount),
          priceId: price.priceId,
          multiple: Number(priceInfo?.price || 0),
          totalPrice: Number(price.amount) * Number(priceInfo?.price || 0),
          folderPriceLog: {
            create: {
              action: ActionType.UPDATE,
              changedBy: changedBy,
              newpriceId: price.priceId,
              newAmount: Number(price.amount),
            },
          },
        };
      });
      await tx.folder.update({
        where: { id: Number(folderId) },
        data: {
          name: folderData.name,
          folderPrice: { create: newPrices },
          folderLog: {
            create: {
              action: ActionType.UPDATE,
              changedBy: changedBy,
              oldName: existingFolder.name,
              newName: folderData.name,
            },
          },
        },
      });
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Folder updated successfully",
    });
    return;
  } catch (error) {
    logger.error("Error updating folder:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to update folder",
    });
    return;
  }
};
export const statusFolderController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status: newStatus } = req.body;
    const currentFolder = await prisma.folder.findUnique({
      where: { id },
    });
    if (!currentFolder) {
      res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "Folder not found",
      });
      return;
    }
    const transactionResult = await prisma.$transaction(async (tx) => {
      const result = await statusFolderService({ id, status: newStatus, tx });
      await createFolderLogService({
        action: ActionType.UPDATE,
        data: currentFolder,
        changedBy: dataTokenPayload(req, res)?.id,
        newStatus: newStatus,
        tx,
      });
      return result;
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Folder status updated successfully",
      result: transactionResult,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      const errorType = classifyError(error);
      const { status, body } = getErrorResponse(errorType);
      logger.error(
        `Step Folder Controller Error (${errorType}):`,
        error.message,
      );
      res.status(status).json(body);
      return;
    }
    logger.error("Unexpected error in stepFolderController:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const getAggregationFolderController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { status, officeId } = req.query;
    if (
      typeof status !== "string" ||
      !Object.values(processStatus).includes(status as processStatus)
    ) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Invalid status parameter",
      });
      return;
    }
    const aggregationResult = await aggregationFolderServices({
      status: status as processStatus,
      officeId: Number(officeId),
    });
    res.json({ status: "ok", message: "Success", result: aggregationResult });
    return;
  } catch (error) {
    logger.error(error);
    let errorMessage = "An error occurred while fetching folder aggregation.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: errorMessage,
      error: "Failed to aggregate folder data",
    });
    return;
  }
};