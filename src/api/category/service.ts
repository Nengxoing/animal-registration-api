import { category } from "@prisma/client";
import { prisma } from "src/prisma/index";
import { addIndexToResults } from "src/utils/addIndexToResults";
import { dateTimeFormat } from "src/utils/dateFormat";
import {
  PaginateCalucations,
} from "src/utils/pagination";

import logger from "src/middleware/logger/config";

export const getAllCategoryService = async ({
  page,
  limit,
  paginate,
  search,
  status,
}: {
  page: number;
  limit: number;
  paginate: boolean;
  search?: any;
  status?: any;
}) => {
  const whereClause = buildWhereClause({
    search,
    status,
  });

  const queryFn = async (skip: number, take: number) => {
    const data = await prisma.category.findMany({
      skip,
      take,
      orderBy: { id: "desc" },
      where: whereClause,
    });
    const totalCount = await prisma.category.count({ where: whereClause });
    return [data, totalCount];
  };
  const paginationResult = await PaginateCalucations({
    page,
    limit,
    queryFn,
    paginate,
  });
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
    whereClause.OR = [{ name: { contains: search, mode: "insensitive" } }];
  }
  if (status !== undefined) {
    const statusTrue = status === "true";
    const statusFalse = status === "false";
    if (statusTrue) {
      whereClause.status = true;
    } else if (statusFalse) {
      whereClause.status = false;
    } else {
      whereClause.status = undefined;
    }
  }
  return whereClause;
};

function formatDate(dataWidthIndex: any[]) {
  return dataWidthIndex.map((data) => ({
    ...data,
    createdAt: dateTimeFormat(data.createdAt),
    updatedAt: dateTimeFormat(data.updatedAt),
  }));
}

export const createCategoryService = async (categoryData: Omit<category, "id">) => {
  try {
    const createCategory = await prisma.category.create({
      data: categoryData,
    });
    return createCategory;
  } catch (error) {
    logger.error(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

