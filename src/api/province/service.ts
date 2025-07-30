import { province } from "@prisma/client";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { PaginateCalucations } from "../../utils/pagination";

export const getAllProvinceService = async ({
  page,
  limit,
  paginate,
  search,
}: {
  page: number;
  limit: number;
  paginate: boolean,
  search?: any;
}) => {
  const whereClause = buildWhereClause({ search });
  const queryFn = async (skip: number, take: number) => {
    const data = await prisma.province.findMany({
      skip,
      take,
      orderBy: { id: "desc" },
      where: whereClause,
    });
    const totalCount = await prisma.province.count({
      orderBy: { id: "desc" },
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
const buildWhereClause = ({ search }: any) => {
  const whereClause: any = {};
  if (search) {
    whereClause.OR = [
      { provinceLao: { contains: search, mode: "insensitive" } },
      { provinceEnglish: { contains: search, mode: "insensitive" } },
    ];
  }
  return whereClause;
};

export const getOneProvinceService = async ({ id }: { id: number }) => {
  try {
    const data = await prisma.province.findUnique({
      where: { id: id },
    });
    return {
      result: [data],
    };
  } catch (error) {
    logger.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

export const createProvincesService = async (provincesData: province[]) => {
  try {
    const createdProvinces = await prisma.province.createMany({
      data: provincesData,
      skipDuplicates: true,
    });
    return createdProvinces;
  } catch (error) {
    logger.error(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const editProvinceService = async ({
  data,
  id,
}: {
  data: Omit<province, "id">;
  id: number;
}) => {
  try {
    const editProfileRes = await prisma.province.update({
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

export const aggregationProvinceServices = async () => {
  try {
    const [TotalActive, total] = await Promise.all([
      prisma.province.count({ where: { status: true } }),
      prisma.province.count(),
    ]);
    return { total, TotalActive };
  } catch (error) {
    logger.error("Error in aggregationprovinceServices:", error);
    throw new Error("Failed to aggregate province data");
  } finally {
    await prisma.$disconnect();
  }
};
