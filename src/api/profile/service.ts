
/* eslint-disable no-magic-numbers */

import { ActionType, Prisma, profile } from "@prisma/client";
import { Request } from "express";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { getImagePath, resolveImageUrls } from "../../utils/fileUrl";
import { PaginateCalucations, validatePaginationParams } from "../../utils/pagination";
import {
  buildWhereClause,
  formatDate,
} from "./lib";
import { IGetAllProfilesServiceProps } from "./types";
export const getAllProfilesService = async ({
  page,
  limit,
  paginate,
  search,
  gender,
  year,
  date,
  officeId,
  barcode,
  officeIds,
  excludeApplications = undefined,
  req,
}: IGetAllProfilesServiceProps & { excludeApplications?: boolean, barcode?: number, req: Request, officeIds?: string }) => {
  try {
    const whereClause = buildWhereClause({
      search,
      gender,
      year,
      date,
      excludeApplications,
      officeId,
      barcode,
      officeIds,
    });
    const queryFn = async (skip: number, take: number) => {
      const data = await prisma.profile.findMany({
        skip,
        take,
        where: whereClause,
        include: {

          profileGallery: {
            select: {
              gallery: {
                select: {
                  image: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      const totalCount = await prisma.profile.count({
        where: whereClause,
      });
      return [data, totalCount];
    };
    const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
    const dataWithIndex = addIndexToResults(paginationResult.result, page, limit);
    const result = resolveImageUrls({ records: dataWithIndex, fields: ["image", "oldImage"], request: req, nestedKey: "profileGallery", nestedImageField: "gallery.image" });
    const formattedDate = formatDate(result);
    return {
      ...paginationResult,
      result: formattedDate,
    };
  } catch (error) {
    logger.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

export const getProfileLogService = async (req: Request) => {
  const paginationParams = validatePaginationParams(req);
  const { profileId, action } = req.query;
  const { page, limit, paginate } = paginationParams;
  const queryFn = async (skip: number, take: number) => {
    const where: Record<string, any> = {
    };
    if (profileId) {
      where.profileId = Number(profileId);
    }
    if (action) {
      where.action = action;
    }
    const data = await prisma.profileLog.findMany({ where, skip, take, orderBy: { id: "desc" } });
    const totalCount = await prisma.profileLog.count({ where });
    return [data, totalCount];
  };
  const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
  const dataWithIndex = addIndexToResults(paginationResult.result, page, limit);
  return {
    ...paginationResult,
    result: dataWithIndex,
  };
};

export const getProfilesBarcodeService = async (req: Request) => {
  const { search, barcode } = req.query;
  if (!search && !barcode) {
    return { result: [] };
  }
  try {
    const data = await prisma.profile.findMany({

      where: {
        barcode: barcode ? parseInt(barcode as string, 10) : undefined,
        OR: search
          ? [
            { lastName: { contains: search as string, mode: "insensitive" } },
            { firstName: { contains: search as string, mode: "insensitive" } },
          ]
          : undefined,
        application: {
          // every: {
          //   status: "FINISHED",
          // },
          // some: {},
        },
      },
      include: {
        application: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            profileId: true,
            company: {
              select: {
                businessCode: true,
                name: true,
              },
            },
            folder: {
              select: {
                billNumber: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return {
      result: data,
    };
  } catch (error) {
    logger.error(error);
    return { result: [] };
  } finally {
    await prisma.$disconnect();
  }
};

export const getOneProfileService = async ({ id, req }: { id: number | string, req: Request }) => {
  try {
    const profileId = Number(id);
    if (isNaN(profileId)) {
      throw new Error("Invalid profile ID: ID must be a number.");
    }
    const data = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {

        profileGallery: {
          select: {
            gallery: {
              select: {
                id: true,
                image: true,
              },
            },
          },
        },
      },
    });
    if (!data) {
      throw new Error(`Profile with ID ${profileId} not found.`);
    }
    const dataWithImagePath = getImagePath({ req, data, field: "image" });
    const dataWithOldImagePath = getImagePath({ req, data: dataWithImagePath, field: "oldImage" });
    const result = resolveImageUrls({ records: dataWithOldImagePath, fields: ["gallery.image"], request: req, nestedKey: "profileGallery", nestedImageField: "gallery.image" });
    return { result };
  } catch (error) {
    logger.error("Error in getOneProfileService:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
export const aggregationProfileServices = async ({
  // start,
  // end,
  // officeId,
}: {
    // start: string;
    // end: string;
    // officeId: number | null;
  }) => {
  try {
    // const startDate = new Date(start);
    // const endDate = new Date(end);

    // const baseWhere = {
    //   deletedAt: null,
    //   ...excludeBlacklistedProfiles,
    // };
    // const whereWithOffice =
    // officeId !== null && !Number.isNaN(officeId) && officeId !== 0
    //   ? { ...baseWhere, officeId }
    //   : baseWhere;

    return 500;
  } catch (error) {
    logger.error("Error in aggregationProfileServices:", error);
    throw new Error("Failed to aggregate profile data");
  } finally {
    await prisma.$disconnect();
  }
};

export const aggregationChartProfileServices = async ({
  // officeId,
}: {
    // officeId: number;
  }) => {
  try {
    const result = await getAggregatedProfileData();
    return result;
  } catch (error) {
    logger.error("Error in aggregationChartProfileServices:", error);
    throw new Error("Failed to aggregate profile data");
  } finally {
    await prisma.$disconnect();
  }
};

const getAggregatedProfileData = async (
  // { officeId }: { officeId: number },
) => {
  return 50; // aggregateProfilesByGender(profiles, months);
};

// const fetchProfilesCreatedInLastSixMonths = async (
//   // sixMonthsAgo: Date,
//   // officeId: number,
// ) => {
//   // const baseWhere = {
//   //   deletedAt: null,
//   //   ...excludeBlacklistedProfiles,
//   // };
//   // const whereWithOffice =
//   // officeId !== null && !Number.isNaN(officeId) && officeId !== 0
//   //   ? { ...baseWhere, officeId }
//   //   : baseWhere;
//   return 0;
// };

export const createProfileService = async (
  profileData: Omit<profile, "id">,
  tx: Prisma.TransactionClient,
) => {
  try {
    const createdProfile = await tx.profile.create({
      data: profileData,
    });
    return createdProfile;
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to create profile data");
  }
};
export const editProfileService = async ({
  data,
  id,
  tx,
}: {
  data: Omit<profile, "id">;
  id: number;
  tx: Prisma.TransactionClient
}) => {
  try {
    const editProfileRes = await tx.profile.update({
      where: { id },
      data,
    });
    return editProfileRes;
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to editing profile data");
  }
};

export const createProfileLogService = async ({
  action,
  data,
  changes,
  changedBy,
  tx,
}: {
  action: ActionType;
  data: Record<string, any>;
  changes?: Record<string, any>;
  changedBy: number;
  tx: Prisma.TransactionClient
}) => {
  const result = {
    profileId: data.id,
    action,
    changedBy,
    oldFirstName: action === ActionType.CREATE ? null : data.firstName ?? null,
    newFirstName: action === ActionType.CREATE ? data.firstName ?? null : changes?.firstName ?? null,
    oldLastName: action === ActionType.CREATE ? null : data.lastName ?? null,
    newLastName: action === ActionType.CREATE ? data.lastName ?? null : changes?.lastName ?? null,
    oldPhoneNumber: action === ActionType.CREATE ? null : data.phoneNumber ?? null,
    newPhoneNumber: action === ActionType.CREATE ? data.phoneNumber ?? null : changes?.phoneNumber ?? null,
  };
  await tx.profileLog.create({ data: result });
  return result;
};
