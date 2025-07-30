import { ActionType, price, Prisma } from "@prisma/client";
import { Request } from "express";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { dateTimeFormat } from "../../utils/dateFormat";
import {
  PaginateCalucations,
  validatePaginationParams,
} from "../../utils/pagination";

export const getAllPriceService = async ({
  page,
  limit,
  paginate,
  search,
  status,
  type,
}: {
  page: number;
  limit: number;
  paginate: boolean;
  search?: any;
  status?: any;
  type?: any;
}) => {
  const whereClause = buildWhereClause({ search, status, type });
  const queryFn = async (skip: number, take: number) => {
    const data = await prisma.price.findMany({
      skip,
      take,
      orderBy: { id: "desc" },
      where: whereClause,
    });
    const totalCount = await prisma.price.count();
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

const buildWhereClause = ({ search, status, type }: any) => {
  const whereClause: any = {};
  if (search) {
    whereClause.OR = [{ name: { contains: search, mode: "insensitive" } }];
  }
  if (type === "BLUE") {
    whereClause.type = "BLUE";
  }
  if (type === "YELLOW") {
    whereClause.type = "YELLOW";
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

export const getOnePriceService = async ({ id }: { id: number }) => {
  try {
    const data = await prisma.price.findUnique({
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

export const createPriceService = async (priceData: Omit<price, "id">) => {
  try {
    const createdPrice = await prisma.price.create({
      data: priceData,
    });
    return createdPrice;
  } catch (error) {
    logger.error(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const editPriceService = async ({ data, id, tx }: { data: Omit<price, "id">; id: number; tx: Prisma.TransactionClient }) => {
  try {
    const editProfileRes = await tx.price.update({
      where: { id },
      data,
    });
    return editProfileRes;
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to edit price data");
  }
};

export const existingPrice = async ({ data }: { data: Omit<price, "id"> }) => {
  const { type, status } = data;
  try {
    const existingPrice = await prisma.price.findFirst({
      where: { status: true, type: type },
    });
    if (existingPrice?.status === true && status === true) {
      throw new Error("ສະຖານະເປີດໃຊ້ງານ ສາມາດເປີດໄດ້ພຽງອັນດຽວ");
    }
    return existingPrice;
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to edit profile data");
  }
};

export const savePriceWithLogService = async (
  newPrice: Omit<price, "id" | "officeId">,
  newPriceLog: any,
) => {
  const transaction = await prisma.$transaction(async (tx) => {
    const createdPrice = await tx.price.create({ data: newPrice });
    newPriceLog.priceId = createdPrice.id;
    const createdLog = await tx.priceLog.create({ data: newPriceLog });
    return { createdPrice, createdLog };
  });
  return transaction;
};

export const getPriceLogService = async (req: Request) => {
  const paginationParams = validatePaginationParams(req);
  const { priceId, action } = req.query;
  const { page, limit, paginate } = paginationParams;
  const queryFn = async (skip: number, take: number) => {
    const where: Record<string, any> = {};
    if (priceId) {
      where.priceId = Number(priceId);
    }
    if (action) {
      where.action = action;
    }
    const data = await prisma.priceLog.findMany({ where, skip, take, orderBy: { id: "desc" } });
    const totalCount = await prisma.priceLog.count({ orderBy: { id: "desc" }, where });
    return [data, totalCount];
  };
  const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
  const dataWithIndex = addIndexToResults(paginationResult.result, page, limit);
  return {
    ...paginationResult,
    result: dataWithIndex,
  };
};

export const createPriceLogService = async ({
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
      priceId: data.id,
      action,
      changedBy,
      oldPrice: action === ActionType.CREATE ? null : data.price ?? null,
      newPrice: action === ActionType.CREATE ? data.price ?? null : changes?.price ?? null,
      oldName: action === ActionType.CREATE ? null : data.name ?? null,
      newName: action === ActionType.CREATE ? data.name ?? null : changes?.name ?? null,
    };
    return await tx.priceLog.create({ data: result });
  } catch (error) {
    throw error;
  }
};