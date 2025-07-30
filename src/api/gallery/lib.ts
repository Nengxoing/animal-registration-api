import { Prisma } from "@prisma/client";
import { Request } from "express";

export const buildGalleryWhereClause = (req: Request) => {
  const { search, officeId, officeIds, createdAt, id } = req.query;
  const MIDNIGHT_HOUR = 0;
  const MIDNIGHT_MINUTE = 0;
  const MIDNIGHT_SECOND = 0;
  const END_OF_DAY_HOUR = 23;
  const END_OF_DAY_MINUTE = 59;
  const END_OF_DAY_SECOND = 59;

  const where: Prisma.galleryWhereInput = {
    image: { not: null },
    deletedAt: null,
  };

  if (search) {
    where.OR = [{ name: { contains: search as string, mode: "insensitive" } }];
  }
  const convertId = id ? parseInt(id as string, 10) : 0;
  if (convertId > 0) {
    where.id = { equals: convertId };
  }
  if (createdAt) {
    const date = new Date(createdAt as string);
    if (!isNaN(date.getTime())) {
      const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        MIDNIGHT_HOUR,
        MIDNIGHT_MINUTE,
        MIDNIGHT_SECOND,
      );
      const endOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        END_OF_DAY_HOUR,
        END_OF_DAY_MINUTE,
        END_OF_DAY_SECOND,
      );
      where.createdAt = { gte: startOfDay, lte: endOfDay };
    }
  }

  const officeIdsList = officeIds ? String(officeIds).split(",").map(Number) : [];
  if (officeIdsList.length > 0) {
    where.officeId = { in: officeIdsList };
  } else if (officeId) {
    where.officeId = Number(officeId);
  }

  return where;
};

export const buildGalleryAggregationWhereClause = (req: Request) => {
  const { officeId, officeIds } = req.query;
  const where: Prisma.galleryWhereInput = {
    image: { not: null },
    deletedAt: null,
  };
  const officeIdsList = officeIds ? String(officeIds).split(",").map(Number) : [];
  if (officeIdsList.length > 0) {
    where.officeId = { in: officeIdsList };
  } else if (officeId) {
    where.officeId = Number(officeId);
  }

  return where;
};