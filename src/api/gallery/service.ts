
import { gallery } from "@prisma/client";
import { Request } from "express";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { getImagePath } from "../../utils/fileUrl";
import { PaginateCalucations, validatePaginationParams } from "../../utils/pagination";
import { buildGalleryAggregationWhereClause, buildGalleryWhereClause } from "./lib";

export const getAllGalleryService = async (req: Request) => {
  try {
    const paginationParams = validatePaginationParams(req);
    const { page, limit, paginate } = paginationParams;
    const whereClause = buildGalleryWhereClause(req);
    const queryFn = async (skip: number, take: number) => {
      const data = await prisma.gallery.findMany({
        skip,
        take,
        orderBy: { id: "desc" },
        where: whereClause,
        include: {
          office: true,
          profileGallery: {
            select: {
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  applicationNumber: true,
                  barcode: true,
                },
              },
            },
          },
        },
      });
      const totalCount = await prisma.gallery.count({ where: whereClause });
      return [data, totalCount];
    };
    const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
    const dateWithImage = getImagePath({ req, data: paginationResult.result, field: "image" });
    const dataWithIndex = addIndexToResults(dateWithImage, page, limit);
    return { ...paginationResult, result: dataWithIndex };
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
export const getOneGalleryService = async ({ id, req }: { id: number | string, req: Request }) => {
  try {
    const galleryId = Number(id);
    if (isNaN(galleryId)) {
      throw new Error("Invalid gallery ID: ID must be a number.");
    }
    const data = await prisma.gallery.findUnique({
      where: { id: galleryId },
    });
    if (!data) {
      throw new Error(`Gallery with ID ${galleryId} not found.`);
    }
    const dataWithImagePath = getImagePath({ req, data, field: "image" });
    return { result: dataWithImagePath };
  } catch (error) {
    logger.error("Error in getOneGalleryService:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const createGalleryService = async (gallery: Omit<gallery, "id">) => {
  try {
    await prisma.gallery.create({
      data: gallery,
    });
    return {
      status: "success",
      message: "New gallery created successfully.",
    };
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to create gallery");
  } finally {
    await prisma.$disconnect();
  }
};

export const editGalleryService = async ({ id, gallery }: { id: number, gallery: Pick<gallery, "name" | "image"> }) => {
  try {
    await prisma.gallery.update({
      where: { id },
      data: gallery,
    });
    return {
      status: "success",
      message: " gallery edit  successfully.",
    };
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to edit gallery");
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteGalleryService = async ({ id, gallery }: { id: number, gallery: Pick<gallery, "deletedAt"> }) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.gallery.update({
        where: { id },
        data: gallery,
      });
      await tx.profileGallery.deleteMany({
        where: { galleryId: id },
      });
    });
    return {
      status: "success",
      message: "delete gallery successfully.",
    };
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to delete gallery");
  } finally {
    await prisma.$disconnect();
  }
};

export const getAggregationGalleryServices = async (req: Request) => {
  const whereClause = buildGalleryAggregationWhereClause(req);
  try {
    const [activeGalleryCount] = await Promise.all([
      prisma.gallery.count({ where: whereClause }),
    ]);
    return {
      result: [
        activeGalleryCount,
      ],
    };
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

