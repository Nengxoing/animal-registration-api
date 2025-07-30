/* eslint-disable max-lines */
import { ActionType, application, applicationStatus, Prisma } from "@prisma/client";
import { Request } from "express";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { resolvezFileUrls } from "../../utils/fileUrl";
import { PaginateCalucations, validatePaginationParams } from "../../utils/pagination";
import { formatDate } from "../profile/lib";
import { buildWhereClause, buildWhereClauseHistory } from "./lib";

export const createApplicationService = async (
  applicationData: Omit<application, "id" | "deletedAt">,
  tx: Prisma.TransactionClient,
) => {
  try {
    const createdApplication = await tx.application.create({
      data: applicationData,
    });
    return createdApplication;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

export const getAllApplicationService = async (req: Request) => {
  const paginationParams = validatePaginationParams(req);
  const { page, limit, paginate } = paginationParams;
  const whereClause = buildWhereClause({ req });
  const queryFn = async (skip: number, take: number) => {
    const data = await prisma.application.findMany({
      skip,
      take,
      orderBy: { id: "desc" },
      where: {
        ...whereClause,
        // folder: {
        //   status: {
        //     in: ["IN_PRODUCTION", "FINISHED"],
        //   },
        // },
      },
      include: {

        number: {
          include: {
            price: true,
          },
        },
        company: true,
        folder: {
          include: {
            folderPrice: true,
          },
        },
        position: true,
        office: true,
        village: true,
        profile: true,
      },
    });
    const totalCount = await prisma.application.count({
      where: whereClause,
    });
    return [data, totalCount];
  };
  const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
  // console.log("Backend whereClause:", whereClause);
  // console.log("Backend findMany data:", data);
  // console.log("Backend totalCount:", totalCount);
  const dateWithImagePatch = getImagePath({ req, data: paginationResult.result });
  const dateWithOldImagePatch = getImagePath({ req, data: dateWithImagePatch });
  return {
    ...paginationResult,
    result: dateWithOldImagePatch,
  };
};

export const getHistoryService = async (req: Request) => {
  const paginationParams = validatePaginationParams(req);
  const { page, limit, paginate } = paginationParams;
  const whereClause = buildWhereClauseHistory({ req });
  const queryFn = async (skip: number, take: number) => {
    const data = await prisma.application.findMany({
      skip,
      take,
      orderBy: { id: "desc" },
      where: whereClause,
      select: {
        id: true,
        companyId: true,
        profileId: true,
        // issueDate: true,
        // expirationDate: true,
        type: true,
        company: {
          select: {
            name: true,
            businessCode: true,
          },
        },
        village: {
          select: {
            villageLao: true,
          },
        },
        applicationFile: {
          select: {
            filePath: true,
          },
        },
        position: {
          select: {
            laoName: true,
          },
        },
      },
    });
    const totalCount = await prisma.application.count({
      where: whereClause,
    });
    return [data, totalCount];
  };

  const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
  const dataWithIndex = addIndexToResults(paginationResult.result, page, limit);
  const result = resolvezFileUrls({ records: dataWithIndex, fields: ["filePath"], request: req, nestedKey: "applicationFile", nestedImageField: "filePath" });
  const formattedDate = formatDate(result);
  return {
    ...paginationResult,
    result: formattedDate,
  };
};
const getImagePath = ({ data, req }: { data: any; req: Request }) => {
  const hostpath = `${req.protocol}://${req.headers.host}`;
  const transformField = (item: any) => ({
    ...item,
    profile: {
      ...item.profile,
      image: item.profile?.image?.startsWith("http")
        ? item.profile.image
        : `${hostpath}${item.profile.image ?? ""}`,
      oldImage: item.profile?.oldImage?.startsWith("http")
        ? item.profile.oldImage
        : `${hostpath}${item.profile.oldImage ?? ""}`,
    },
  });

  return Array.isArray(data) ? data.map(transformField) : transformField(data);
};

export const getApplicationLogService = async (req: Request) => {
  const paginationParams = validatePaginationParams(req);
  const { applicationId, action } = req.query;
  const { page, limit, paginate } = paginationParams;
  const queryFn = async (skip: number, take: number) => {
    const where: Record<string, any> = {};
    if (applicationId) {
      where.applicationId = Number(applicationId);
    }
    if (action) {
      where.actionTaken = action;
    }
    const data = await prisma.applicationLog.findMany({ where, skip, take, orderBy: { id: "desc" } });
    const totalCount = await prisma.applicationLog.count({ where });
    return [data, totalCount];
  };
  const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
  const dataWithIndex = addIndexToResults(paginationResult.result, page, limit);
  return {
    ...paginationResult,
    result: dataWithIndex,
  };
};

export const statusApplicationService = async ({
  id,
  status,
  printCount,
}: {
  id: number;
  status: applicationStatus;
  printCount: number
}) => {
  try {
    const updatedFolder = await prisma.application.update({
      where: { id },
      data: { status: status, printCount, updatedAt: new Date() },
    });
    return updatedFolder;
  } catch (error) {
    logger.error("Step Progression Error:", error);
    throw error;
  }
};

export const createApplicationLogService = async ({
  action,
  data,
  changedBy,
  tx,
}: {
  action: ActionType;
  data: Record<string, any>;
  changedBy: number;
  tx: Prisma.TransactionClient,
}) => {
  try {
    if (!data.id) {
      throw new Error("Missing application ID for creating application log.");
    }
    const result = {
      applicationId: data.id,
      actionTaken: action,
      changedById: changedBy,
    };
    return await tx.applicationLog.create({ data: result });
  } catch (error) {
    throw error;
  }
};

export const updateManyApplicationStatusService = async (
  ids: number[],
  status: applicationStatus,
) => {
  try {
    const updatedApplications = await prisma.application.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status: status,
        updatedAt: new Date(),
      },
    });

    return updatedApplications;
  } catch (error) {
    throw error;
  }
};

// export const getOneApplicationService = async ({ id, req }: { id: number | string, req: Request }) => {
//   const hostpath = `${req.protocol}://${req.headers.host}`;
//   try {
//     const applicationId = Number(id);
//     if (isNaN(applicationId)) {
//       throw new Error("Invalid application ID: ID must be a number.");
//     }
//     const data = await prisma.application.findUnique({
//       where: { id: applicationId },
//       include: {
//         profile: true,
//       },
//     });
//     if (!data) {
//       throw new Error(`Application with ID ${applicationId} not found.`);
//     }
//     const transformField = (item: any) => {
//       const imagePath = item?.profile?.image ? `${hostpath}${item.profile.image}` : null;
//       return {
//         ...item,
//         profile: {
//           ...item.profile,
//           image: imagePath,
//         },
//       };
//     };
//     return { result: transformField(data) };
//   } catch (error) {
//     logger.error("Error in getOneApplicationService:", error);
//     throw error;
//   } finally {
//     await prisma.$disconnect();
//   }
// };

export const getOneApplicationService = async ({ id, req }: { id: number | string, req: Request }) => {
  const hostpath = `${req.protocol}://${req.headers.host}`;
  try {
    const applicationId = Number(id);
    if (isNaN(applicationId)) {
      throw new Error("Invalid application ID: ID must be a number.");
    }

    const applicationData = await prisma.application.findUnique({
      where: { id: applicationId },
      select: {
        id: true,
        createdAt: true,
        profile: {
          select: {
            image: true,
            firstName: true,
            lastName: true,
            gender: true,
          },
        },
        applicationNumber: true,
        company: {
          select: {
            name: true,
            businessCode: true,
          },
        },
        village: {
          select: {
            villageLao: true,
          },
        },
        folder: {
          select: {
            name: true,
            billNumber: true,
          },
        },
        status: true,
        type: true,
        updatedAt: true,
        deletedAt: true,
        officeId: true,
        numberId: true,
        folderId: true,
        positionId: true,
        companyId: true,
        printCount: true,
        dependBy: true,
        villageId: true,
      },
    });

    if (!applicationData) {
      throw new Error(`Application with ID ${applicationId} not found.`);
    }

    const transformedProfile = applicationData.profile ? {
      ...applicationData.profile,
      image: applicationData.profile.image ? `${hostpath}${applicationData.profile.image}` : null,
    } : null;

    const transformedData = {
      ...applicationData,
      profile: transformedProfile,
    };

    return { result: transformedData };
  } catch (error) {
    logger.error("Error in getOneApplicationService:", error);
    throw error;
  } finally {
    // await prisma.$disconnect();
  }
};

export const editApplicationService = async ({
  data,
  id,
}: {
  data: {
    positionId: number;
    companyId: number | null;
    villageId?: number | null;
    updatedAt?: Date;
    dependBy?: any;
    applicationFile?: {
      deleteMany: {};
      create: {
        name: string;
        filePath: string;
      }[];
    };
  };
  id: number;
}) => {
  try {
    const editProfileRes = await prisma.application.update({
      where: { id },
      data,
    });
    return editProfileRes;
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to edit profile data");
  } finally {
    await prisma.$disconnect();
  }
};

export const getLastOneService = async (req: Request) => {
  const id = Number(req.params.id);

  if (!id) {
    throw new Error("profileId is required");
  }

  const lastApplication = await prisma.application.findFirst({
    where: {
      profileId: Number(id),
    },
    orderBy: {
      createdAt: "desc",
    },
    // select: {
    //   issueDate: true,
    //   expirationDate: true,
    // },
  });

  return {
    result: lastApplication,
  };
};

export const aggregationApplicationServices = async ({
  start,
  end,
  officeId,
}: {
  start: string;
  end: string;
  officeId: number | null;
}) => {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const baseWhere = {
      deletedAt: null,
    };
    const whereWithOffice =
      officeId !== null && !Number.isNaN(officeId) && officeId !== 0
        ? { ...baseWhere, officeId }
        : baseWhere;
    const [total, maleCounts, femaleCounts, newProfilesCount, femaleNewProfilesCount] = await Promise.all([
      prisma.application.count({
        where: whereWithOffice,
      }),
      prisma.application.count({
        where: {
          ...whereWithOffice,
          profile: {
            is: {
              gender: {
                in: ["MALE", "M"],
              },
            },
          },
        },
      }),
      prisma.application.count({
        where: {
          ...whereWithOffice,
          profile: {
            is: {
              gender: {
                in: ["MALE", "M"],
              },
            },
          },
        },
      }),
      prisma.application.count({
        where: {
          ...whereWithOffice,
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      prisma.application.count({
        where: {
          ...whereWithOffice,
          createdAt: { gte: startDate, lte: endDate },
          profile: {
            is: {
              gender: {
                in: ["MALE", "M"],
              },
            },
          },
        },
      }),
    ]);

    return { total, male: maleCounts, female: femaleCounts, newProfilesCount, femaleNewProfilesCount };
  } catch (error) {
    logger.error("Error in aggregationProfileServices:", error);
    throw new Error("Failed to aggregate profile data");
  } finally {
    await prisma.$disconnect();
  }
};

export const getFoldersByCompanyId = async (companyId: number) => {
  const folders = await prisma.application.findMany({
    where: { companyId },
    select: {
      folderId: true,
      folder: {
        select: {
          name: true,
          billNumber: true,
        },
      },
    },
    distinct: ["folderId"],
  });
  console.log("Data from folders:", folders);
  return folders;
};