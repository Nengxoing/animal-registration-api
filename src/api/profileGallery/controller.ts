import { profileGallery } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma";
import { findRecordById } from "../lib";
import {
  createProfileGalleryService,
  deleteProfileGalleryService,
  editProfileGalleryService,
  getAllProfileGalleryService,
  getOneProfileGalleryService,
} from "./service";

export const getAllProfileGalleryController = async (req: Request, res: Response) => {
  try {
    const result = await getAllProfileGalleryService(req);
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
export const getOneProfileGalleryController = async (req: Request, res: Response) => {
  try {
    const result = await getOneProfileGalleryService({ id: Number(req.params.id), req });
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

export const createProfileGalleryController = async (req: Request, res: Response) => {
  try {
    const updatedAt = new Date();
    const { galleryId, profileId } = req.body;
    await findRecordById(prisma.profile, profileId, "Profile not found");
    await findRecordById(prisma.gallery, galleryId, "Gallery not found");
    const newProfileGallery = { galleryId, profileId, deletedAt: null, updatedAt } as profileGallery;
    const createdProfileGallery = await createProfileGalleryService(newProfileGallery);
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "ProfileGallery created successfully",
      result: createdProfileGallery,
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
  finally {
    await prisma.$disconnect();
  }
};

export const editProfileGalleryController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updatedAt = new Date();
    const { galleryId, profileId } = req.body;
    await findRecordById(prisma.profile, profileId, "Profile not found");
    await findRecordById(prisma.gallery, galleryId, "Gallery not found");
    const newProfileGallery = { galleryId, profileId, deletedAt: null, updatedAt } as profileGallery;
    const editProfileGallery = await editProfileGalleryService({ id, profileGallery: newProfileGallery });
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "ProfileGallery edit successfully",
      result: editProfileGallery,
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

export const deleteProfileGalleryController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deletedAt = new Date();
    const deleteRecord = { deletedAt } as profileGallery;
    const deleteProfileGallery = await deleteProfileGalleryService({ id, profileGallery: deleteRecord });
    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "ProfileGallery delete successfully",
      result: deleteProfileGallery,
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
