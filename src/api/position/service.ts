/* eslint-disable no-nested-ternary */
import { position } from "@prisma/client";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { dateTimeFormat } from "../../utils/dateFormat";
import { PaginateCalucations } from "../../utils/pagination";

export const getAllPositionService = async ({
  page,
  limit,
  order,
  search,
  status,
  paginate,
}: {
  page: number;
  limit: number;
  order: "asc" | "desc";
  search?: any;
  status?: any;
  paginate?: boolean;
}) => {
  const whereClause = buildWhereClause({ search, status });
  const queryFn = async (skip: number, take: number) => {
    const data = await prisma.position.findMany({
      skip,
      take,
      orderBy: { id: order },
      where: whereClause,
    });
    const totalCount = await prisma.position.count({
      orderBy: { id: "desc" },
    });
    return [data, totalCount];
  };
  const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
  const dataWithIndex = addIndexToResults(paginationResult.result, page, limit);
  const formattedDate = formatDate(dataWithIndex);
  return {
    ...paginationResult,
    result: formattedDate,
  };
};
const buildWhereClause = ({ search, status }: any) => {
  const whereClause: any = {};
  if (search) {
    whereClause.OR = [
      { englishName: { contains: search, mode: "insensitive" } },
      { laoName: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status !== undefined) {
    const statusTrue = status === "true";
    const statusFalse = status === "false";
    whereClause.status = statusTrue ? true : statusFalse ? false : undefined;
  }
  return whereClause;
};
function formatDate(dataWithIndex: any[]) {
  return dataWithIndex.map((data) => ({
    ...data,
    createdAt: dateTimeFormat(data.createdAt, "DD/MM/YYYY"),
    updatedAt: dateTimeFormat(data.updatedAt, "DD/MM/YYYY"),
  }));
}
export const getOnePositionService = async ({ id }: { id: number }) => {
  try {
    const data = await prisma.position.findUnique({
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

export const createPositionService = async (
  positionData: Omit<position, "id">,
) => {
  try {
    const createdPosition = await prisma.position.create({
      data: positionData,
    });
    return createdPosition;
  } catch (error) {
    logger.error(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const editPositionService = async ({
  data,
  id,
}: {
  data: Omit<position, "id">;
  id: number;
}) => {
  try {
    const editProfileRes = await prisma.position.update({
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

export const aggregationPositionServices = async () => {
  try {
    const [TotalActive, total] = await Promise.all([
      prisma.position.count({ where: { status: true } }),
      prisma.position.count(),
    ]);
    return { total, TotalActive };
  } catch (error) {
    logger.error("Error in aggregationpositionServices:", error);
    throw new Error("Failed to aggregate position data");
  } finally {
    await prisma.$disconnect();
  }
};
