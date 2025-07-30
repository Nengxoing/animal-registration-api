/* eslint-disable no-magic-numbers */

/* eslint-disable max-depth */
import { ActionType } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { processFileUrl } from "../../utils/fileUrl";
import { dataTokenPayload } from "../../utils/lib";
import { validatePaginationParams } from "../../utils/pagination";
import { buildProfileRecord, generateBarcode } from "./lib";
import {
  aggregationChartProfileServices,
  aggregationProfileServices,
  createProfileLogService,
  createProfileService,
  getAllProfilesService,
  getOneProfileService,
  getProfileLogService,
  getProfilesBarcodeService,
} from "./service";

export const getAllProfileController = async (req: Request, res: Response) => {
  const pagination = validatePaginationParams(req);
  if (!pagination) {
    return;
  }
  const { search, gender, excludeApplications, officeId, barcode, officeIds, year, date } =
    req.query;
  const parsedDate = date ? new Date(date.toString()) : undefined;
  try {
    const result = await getAllProfilesService({
      page: pagination.page,
      limit: pagination.limit,
      paginate: pagination.paginate,
      search: search?.toString(),
      gender: gender?.toString(),
      year: year?.toString(),
      date: parsedDate,
      officeId: Number(officeId),
      barcode: Number(barcode),
      officeIds: officeIds?.toString(),
      excludeApplications: excludeApplications === "true" || undefined,
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
      message: "Failed to fetch application requests",
    });
  }
};

export const getProfileBarcodeController = async (req: Request, res: Response) => {
  try {
    const result = await getProfilesBarcodeService(req);
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

export const getProfileLogController = async (req: Request, res: Response) => {
  try {
    const result = await getProfileLogService(req);
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

export const getOneProfileController = async (req: Request, res: Response) => {
  try {
    const result = await getOneProfileService({ id: Number(req.params.id), req });
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

export const getAggregationProfileController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { start, end, officeId } = req.query;
    const aggregationResult = await aggregationProfileServices({
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
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching user aggregation.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return;
  }
};

export const getAggregationChartProfileController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { officeId } = req.query;
    const aggregationResult = await aggregationChartProfileServices({
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
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching user aggregation.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return;
  }
};

export const createProfileController = async (req: Request, res: Response) => {
  try {
    const changedBy = Number(dataTokenPayload(req, res)?.id);
    const officeId = dataTokenPayload(req, res)?.officeId;
    const image = processFileUrl(req, "image");
    const oldImage = processFileUrl(req, "oldImage");
    let barcode: string;
    let isUnique = false;
    while (!isUnique) {
      barcode = generateBarcode();
      const existingProfile = await prisma.profile.findFirst({
        where: { barcode: parseInt(barcode, 10) },
      });
      if (!existingProfile) {
        isUnique = true;
      }
    }
    const transactionResult = await prisma.$transaction(async (tx) => {
      const newProfile = buildProfileRecord({
        profile: req.body,
        imagePath: image,
        oldImage: oldImage,
        officeId,
        barcode,
      });
      const createdProfile = await createProfileService(newProfile as any, tx);
      await createProfileLogService({
        action: ActionType.CREATE,
        data: createdProfile,
        changedBy,
        tx,
      });

      return createdProfile;
    });
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Profile created successfully",
      result: transactionResult,
    });
  } catch (error) {
    logger.error("Error creating profile", error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const editProfileController = async (req: Request, res: Response) => {
  try {
    // const id = Number(req.params.id);
    // const getImage = await processFileUrl(req, "image");
    // const getOldImage = await processFileUrl(req, "oldImage");
    // const updatedRecord = buildEditProfileRecord({ profile: req.body, imagePath: getImage, oldImage: getOldImage });
    // const changedBy = Number(dataTokenPayload(req, res)?.id);

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
export const deleteProfileController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const deleteProfile = await prisma.profile.delete({
      where: { id: id },
    });
    return res.status(200).json({
      message: "Profile deleted successfully",
      deleteProfile,
    });
  } catch (error: any) {
    return res.status(500).json({
      massage: "Error deleting profile",
      error: error.massage,
    });
  }
};

export const checkProfileExistenceController = async (req: Request, res: Response) => {
  const { applicationNumber } = req.body;

  try {
    const currentYear = new Date().getFullYear();
    const existing = await prisma.profile.findFirst({

    });
    let existingApplicationNumber = null;
    if (applicationNumber) {
      existingApplicationNumber = await prisma.profile.findFirst({
        where: {
          applicationNumber,
          createdAt: {
            gte: new Date(`${currentYear}-01-01`),
            lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      });
    }
    if (existing || existingApplicationNumber) {
      res.status(400).json({
        applicationNumber: existingApplicationNumber ? "ເລກທີຟອມນີ້ມີຢູ່ໃນລະບົບແລ້ວ" : null,
        identityExists: true,
      });
      return;
    }

    res.json({
      identityExists: false,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error checking profile data",
      error: error.message,
    });
    return;
  }
};