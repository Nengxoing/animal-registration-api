
import { profileGallery } from "@prisma/client";
import { Request } from "express";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { resolveImageUrls } from "../../utils/fileUrl";
import { PaginateCalucations, validatePaginationParams } from "../../utils/pagination";
import { buildProfileGalleryWhereClause } from "./lib";

export const getAllProfileGalleryService = async (req: Request) => {
  try {
    const paginationParams = validatePaginationParams(req);
    const { page, limit, paginate } = paginationParams;
    const whereClause = buildProfileGalleryWhereClause(req);
    const queryFn = async (skip: number, take: number) => {
      const data = await prisma.profileGallery.findMany({
        skip,
        take,
        orderBy: { id: "desc" },
        where: whereClause,
        include: {
          profile: { select: { firstName: true, lastName: true, applicationNumber: true } },
          gallery: { select: { name: true, image: true } },
        },
      });
      const totalCount = await prisma.profileGallery.count({ where: whereClause });
      return [data, totalCount];
    };
    const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
    const dataWithIndex = addIndexToResults(paginationResult.result, page, limit);
    const result = resolveImageUrls({ records: dataWithIndex, fields: ["image"], request: req, nestedKey: "gallery" });
    return { ...paginationResult, result: result };
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
export const getOneProfileGalleryService = async ({ id, req }: { id: number | string, req: Request }) => {
  try {
    const profileId = Number(id);
    if (isNaN(profileId)) {
      throw new Error("Invalid profileGallery ID: ID must be a number.");
    }
    const data = await prisma.profileGallery.findFirst({
      where: { profileId: profileId },
      orderBy: { createdAt: "desc" },
      include: {
        profile: { select: { firstName: true, lastName: true, applicationNumber: true } },
        gallery: { select: { name: true, image: true } },
      },
    });
    if (!data) {
      throw new Error(`ProfileGallery with ID ${profileId} not found.`);
    }
    const result = resolveImageUrls({ records: data, fields: ["image"], request: req, nestedKey: "gallery" });
    return { result: result };
  } catch (error) {
    logger.error("Error in getOneProfileGalleryService:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const createProfileGalleryService = async (profileGallery: Omit<profileGallery, "id">) => {
  try {
    await prisma.profileGallery.create({
      data: profileGallery,
    });
    return {
      status: "success",
      message: "New profileGallery created successfully.",
    };
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to create profileGallery");
  } finally {
    await prisma.$disconnect();
  }
};

export const editProfileGalleryService = async ({ id, profileGallery }: { id: number, profileGallery: Pick<profileGallery, "id"> }) => {
  try {
    await prisma.profileGallery.update({
      where: { id },
      data: profileGallery,
    });
    return {
      status: "success",
      message: " profileGallery edit  successfully.",
    };
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to edit profileGallery");
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteProfileGalleryService = async ({ id, profileGallery }: { id: number, profileGallery: Pick<profileGallery, "deletedAt"> }) => {
  try {
    await prisma.profileGallery.update({
      where: { id },
      data: profileGallery,
    });
    return {
      status: "success",
      message: "delete profileGallery  successfully.",
    };
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to delete profileGallery");
  } finally {
    await prisma.$disconnect();
  }
};
