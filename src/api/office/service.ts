import { ActionType, office, Prisma } from "@prisma/client";
import { Request } from "express";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { dateTimeFormat } from "../../utils/dateFormat";
import { PaginateCalucations, validatePaginationParams } from "../../utils/pagination";

export const getAllOfficeService = async ({
  page,
  limit,
  paginate,
  req,
}: {
  page: number;
  limit: number;
  paginate: boolean,
  req: Request;
}) => {
  const { search, status, provinceId, districtId } = req.query;
  const whereClause = buildWhereClause({
    search,
    status,
    provinceId,
    districtId,
  });
  const queryFn = async (skip: number, take: number) => {
    const data = await prisma.office.findMany({
      skip,
      take,
      orderBy: { id: "desc" },
      where: whereClause,
      select: {
        id: true,
        name: true,
        status: true,
        province: true,
        district: true,
        village: true,
      },
    });
    const totalCount = await prisma.office.count();
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

export const getOfficeLogService = async (req: Request) => {
  const paginationParams = validatePaginationParams(req);
  const { officeId, action } = req.query;
  const { page, limit, paginate } = paginationParams;
  const queryFn = async (skip: number, take: number) => {
    const where: Record<string, any> = {};
    if (officeId) {
      where.officeId = Number(officeId);
    }
    if (action) {
      where.action = action;
    }
    const data = await prisma.officeLog.findMany({ where, skip, take, orderBy: { id: "desc" } });
    const totalCount = await prisma.officeLog.count({ where });
    return [data, totalCount];
  };
  const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
  const dataWithIndex = addIndexToResults(paginationResult.result, page, limit);
  return {
    ...paginationResult,
    result: dataWithIndex,
  };
};

const buildWhereClause = ({ search, status, provinceId, districtId }: any) => {
  const whereClause: any = {};
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { village: { contains: search, mode: "insensitive" } },
    ];
  }
  if (provinceId) {
    whereClause.provinceId = Number(provinceId);
  }
  if (districtId) {
    whereClause.districtId = Number(districtId);
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

function formatDate(dataWithIndex: any[]) {
  return dataWithIndex.map((data) => ({
    ...data,
    createdAt: dateTimeFormat(data.createdAt, "DD/MM/YYYY"),
    updatedAt: dateTimeFormat(data.updatedAt, "DD/MM/YYYY"),
  }));
}

export const getOneOfficeService = async ({ id }: { id: number }) => {
  try {
    const data = await prisma.office.findUnique({
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

export const createOfficeService = async (officeData: Omit<office, "id">, tx: Prisma.TransactionClient) => {
  try {
    return await tx.office.create({
      data: officeData,
    });
  } catch (error) {
    logger.error(error);
    return null;
  }
};

export const editOfficeService = async ({
  data,
  id,
  tx,
}: {
  data: Omit<office, "id">;
  id: number;
  tx: Prisma.TransactionClient;
}) => {
  try {
    return await tx.office.update({
      where: { id },
      data,
    });
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to edit office data");
  }
};
export const aggregationOfficeServices = async () => {
  try {
    const [TotalActive, total] = await Promise.all([
      prisma.office.count({ where: { status: true } }),
      prisma.office.count(),
    ]);
    return { total, TotalActive };
  } catch (error) {
    logger.error("Error in aggregationOfficeServices:", error);
    throw new Error("Failed to aggregate office data");
  } finally {
    await prisma.$disconnect();
  }
};

export const createOfficeLogService = async ({
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
  try {
    const result = {
      officeId: data.id,
      action,
      changedBy,
      oldName: action === ActionType.CREATE ? null : data.name ?? null,
      newName: action === ActionType.CREATE ? data.name ?? null : changes?.name ?? null,
      oldStatus: action === ActionType.CREATE ? null : data.status ?? null,
      newStatus: action === ActionType.CREATE ? data.status ?? null : changes?.status ?? null,
    };
    return await tx.officeLog.create({ data: result });
  } catch (error) {
    throw error;
  }
};
