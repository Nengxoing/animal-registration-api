import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../middleware/logger/config";

import { ActionType } from "@prisma/client";
import { prisma } from "../../prisma/index";
import { getFileUrlsWithName } from "../../utils/fileUrl";
import { dataTokenPayload } from "../../utils/lib";
import { buildApplicationFileRecord, buildApplicationRecord, buildApplicationRecordEdit } from "./lib";
import { aggregationApplicationServices, createApplicationLogService, createApplicationService, editApplicationService, getAllApplicationService, getApplicationLogService, getFoldersByCompanyId, getHistoryService, getLastOneService, getOneApplicationService, statusApplicationService, updateManyApplicationStatusService } from "./service";

export const createApplicationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const applicationFile = getFileUrlsWithName(req);
    const payload = dataTokenPayload(req, res);
    const officeId = dataTokenPayload(req, res)?.officeId;
    if (!payload) {
      res.status(StatusCodes.FORBIDDEN).json({
        status: "error",
        message: "Forbidden",
      });
      return;
    }
    const newApplication = buildApplicationRecord(req.body, officeId, applicationFile);
    const transactionResult = await prisma.$transaction(async (tx) => {
      const createdApplication = await createApplicationService(newApplication, tx);
      if (!createdApplication) {
        throw new Error("Failed to create application");
      }
      await tx.number.update({
        where: { id: createdApplication.numberId },
        data: { isAvailable: false },
      });
      await createApplicationLogService({
        action: ActionType.CREATE,
        data: createdApplication as Record<string, any>,
        changedBy: payload.id,
        tx,
      });
      return createdApplication;
    });
    res.status(StatusCodes.OK).json(transactionResult);
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

export const getAllApplicationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getAllApplicationService(req);
    res.json({
      status: "ok",
      message: "success",
      ...result,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch application",
    });
  }
};
export const getHistoryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getHistoryService(req);
    res.json({
      status: "ok",
      message: "success",
      ...result,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch application history",
    });
  }
};
export const getLastOneController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getLastOneService(req);
    res.json({
      status: "ok",
      message: "success",
      ...result,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch last application",
    });
  }
};

export const getOneApplicationController = async (req: Request, res: Response) => {
  try {
    const result = await getOneApplicationService({ id: Number(req.params.id), req });
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

export const getApplicationController = async (req: Request, res: Response) => {
  try {
    const result = await getApplicationLogService(req);
    res.json({
      status: "ok",
      message: "success",
      ...result,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch office logs",
    });
  }
};

export const statusApplicationController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const changedBy = dataTokenPayload(req, res)?.id;
    const transactionResult = await prisma.$transaction(async (tx) => {
      const currentApplication = await tx.application.findUnique({ where: { id } });
      if (!currentApplication) {
        res.status(StatusCodes.NOT_FOUND).json({
          status: "error",
          message: "Application not found",
        });
        return;
      }
      const printCount = currentApplication.printCount + 1;
      const { status } = req.body;
      const updatedApplication = await statusApplicationService({ id, status, printCount });
      await createApplicationLogService({
        action: ActionType.UPDATE,
        data: updatedApplication as Record<string, any>,
        changedBy,
        tx,
      });
      return updatedApplication;
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Application status updated successfully",
      result: transactionResult,
    });
  } catch (error: unknown) {
    logger.error("Unexpected error in stepApplicationController:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const updateManyApplicationStatusController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { ids, status } = req.body;
    if (!ids || !status) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "IDs and status are required",
      });
      return;
    }
    const updatedApplications = await updateManyApplicationStatusService(ids, status);
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Applications status updated successfully",
      result: updatedApplications,
    });
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
export const ediApplicationController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const applicationFile = getFileUrlsWithName(req);
    const companyId = Number(req.body.companyId) === 0 ? undefined : req.body.companyId ?? null;
    const villageId = Number(req.body.villageId) === 0 ? undefined : req.body.villageId ?? null;
    const newRecord = buildApplicationRecordEdit({ data: req.body, applicationFile, companyId, villageId });
    const createdApplication = await editApplicationService({
      data: newRecord,
      id,
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Application edit successfully",
      result: createdApplication,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};

export const uploadFileController = async (
  req: Request,
  res: Response,
) => {
  try {
    const applicationFile = getFileUrlsWithName(req);
    const payload = dataTokenPayload(req, res);
    if (!payload) {
      res.status(StatusCodes.FORBIDDEN).json({
        status: "error",
        message: "Forbidden",
      });
      return;
    }
    const applicationId = Number(req.params.id);
    const newApplicationFile = buildApplicationFileRecord(applicationFile, applicationId);
    const transactionResult = await prisma.$transaction(async (tx) => {
      const insertedFiles = await tx.applicationFile.createMany({
        data: newApplicationFile,
        skipDuplicates: true,
      });
      return insertedFiles;
    });
    res.status(StatusCodes.OK).json(transactionResult);
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

export const getAggregationApplicationController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { start, end, officeId } = req.query;
    const aggregationResult = await aggregationApplicationServices({
      start: start as string,
      end: end as string,
      officeId: Number(officeId),
    });
    res.json({
      status: "ok",
      message: "Success",
      result: aggregationResult,
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

// export const getFoldersByCompanyIdController = async (req: Request, res: Response) => {
//   try {
//     const companyId = Number(req.params.companyId);
//     if (isNaN(companyId)) {
//       return res.status(StatusCodes.BAD_REQUEST).json({ status: "error", message: "Invalid companyId" });
//     }
//     const folders = await getFoldersByCompanyId(companyId);
//     res.json({ status: "ok", message: "success", result: folders });
//   } catch (error) {
//     logger.error(error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: "error", message: "Failed to fetch folders" });
//   }
// };

export const getFoldersByCompanyIdController = async (req: Request, res: Response) => {
  try {
    const companyId = Number(req.params.companyId);
    if (isNaN(companyId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ status: "error", message: "Invalid companyId" });
      return;
    }
    const folders = await getFoldersByCompanyId(companyId);
    res.json({ status: "ok", message: "success", result: folders });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: "error", message: "Failed to fetch folders" });
  }
};