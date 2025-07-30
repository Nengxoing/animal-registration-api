import { village } from "@prisma/client";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { PaginateCalucations } from "../../utils/pagination";

export const getAllVillageService = async ({
  page,
  limit,
  search,
  districtId,
  paginate,
}: {
  page: number;
  limit: number;
  search?: any;
  districtId?: number;
  paginate?: boolean;
}) => {
  const whereClause = buildWhereClause({ search, districtId });
  const queryFn = async (skip: number, take: number) => {
    const data = await prisma.village.findMany({
      skip,
      take,
      orderBy: { id: "desc" },
      where: whereClause,
      include: {
        district: true,
      },
    });
    const totalCount = await prisma.village.count({
      where: whereClause,
    });
    return [data, totalCount];
  };
  const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
  const dataWithIndex = addIndexToResults(paginationResult.result, page, limit);
  return {
    ...paginationResult,
    result: dataWithIndex,
  };
};

const buildWhereClause = ({
  search,
  districtId,
}: {
  search?: string;
  districtId?: number;
}) => {
  const whereClause: any = {};
  if (search) {
    whereClause.OR = [
      { villageLao: { contains: search, mode: "insensitive" } },
      { villageEnglish: { contains: search, mode: "insensitive" } },
    ];
  }
  if (districtId) {
    whereClause.districtId = districtId;
  }
  return whereClause;
};

export const getOneVillageService = async ({ id }: { id: number }) => {
  try {
    const data = await prisma.village.findUnique({
      where: { id: id },
    });
    return {
      result: data,
    };
  } catch (error) {
    logger.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

export const createVillagesService = async (villagesData: village) => {
  try {
    await prisma.village.create({
      data: villagesData,
    });
    return {
      status: "success",
      message: "New villages created successfully.",
    };
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to create villages");
  } finally {
    await prisma.$disconnect();
  }
};

export const editVillageService = async ({
  data,
  id,
}: {
  data: Omit<village, "id">;
  id: number;
}) => {
  try {
    const editProfileRes = await prisma.village.update({
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

export const aggregationVillageServices = async () => {
  try {
    const [TotalActive, total] = await Promise.all([
      prisma.village.count({ where: { status: true } }),
      prisma.village.count(),
    ]);
    return { total, TotalActive };
  } catch (error) {
    logger.error("Error in aggregationVillageServices:", error);
    throw new Error("Failed to aggregate village data");
  } finally {
    await prisma.$disconnect();
  }
};
