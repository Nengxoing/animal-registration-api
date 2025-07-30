import { gallery } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../middleware/logger/config";
import { processFileUrl } from "../../utils/fileUrl";
import { dataTokenPayload } from "../../utils/lib";
import {
  createGalleryService,
  deleteGalleryService,
  editGalleryService,
  getAggregationGalleryServices,
  getAllGalleryService,
  getOneGalleryService,
} from "./service";

export const getAllGalleryController = async (req: Request, res: Response) => {
  try {
    const result = await getAllGalleryService(req);
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
export const getOneGalleryController = async (req: Request, res: Response) => {
  try {
    const result = await getOneGalleryService({ id: Number(req.params.id), req });
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

export const createGalleryController = async (req: Request, res: Response) => {
  try {
    const updatedAt = new Date();
    const officeId = dataTokenPayload(req, res)?.officeId;
    const image = processFileUrl(req, "image");
    const { name } = req.body;
    const newGallery = { officeId, image, name, deletedAt: null, updatedAt } as gallery;
    const createdGallery = await createGalleryService(newGallery);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Gallery created successfully",
      result: createdGallery,
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

export const editGalleryController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const image =  processFileUrl(req, "image");
    const { name } = req.body;
    const updatedAt = new Date();
    const updatedRecord  = { image, name, updatedAt } as gallery;
    const editGallery = await editGalleryService({ id, gallery: updatedRecord });
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Gallery edit successfully",
      result: editGallery,
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

export const deleteGalleryController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deletedAt = new Date();
    const deleteRecord  = { deletedAt } as gallery;
    const deleteGallery = await deleteGalleryService({ id, gallery: deleteRecord });
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Gallery delete successfully",
      result: deleteGallery,
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

export const getAggregationGalleryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const aggregationResult = await getAggregationGalleryServices(req);
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
