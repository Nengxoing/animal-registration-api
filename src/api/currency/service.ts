
import { currency, Prisma } from "@prisma/client";
import { Request } from "express";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { getImagePath } from "../../utils/fileUrl";
import { PaginateCalucations, validatePaginationParams } from "../../utils/pagination";
import { buildCurrencyAggregationWhereClause, buildCurrencyWhereClause } from "./lib";

export const getAllCurrencyService = async (req: Request) => {
  try {
    const paginationParams = validatePaginationParams(req);
    const { page, limit, paginate } = paginationParams;
    const whereClause = buildCurrencyWhereClause(req);
    const queryFn = async (skip: number, take: number) => {
      const data = await prisma.currency.findMany({
        skip,
        take,
        orderBy: { id: "desc" },
        where: whereClause,
      });
      const totalCount = await prisma.currency.count({ where: whereClause });
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
export const getOneCurrencyService = async ({ id, req }: { id: number | string, req: Request }) => {
  try {
    const currencyId = Number(id);
    if (isNaN(currencyId)) {
      throw new Error("Invalid currency ID: ID must be a number.");
    }
    const data = await prisma.currency.findUnique({
      where: { id: currencyId },
    });
    if (!data) {
      throw new Error(`Currency with ID ${currencyId} not found.`);
    }
    const dataWithImagePath = getImagePath({ req, data, field: "image" });
    return { result: dataWithImagePath };
  } catch (error) {
    logger.error("Error in getOneCurrencyService:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const createCurrencyService = async (currency: Omit<currency, "id">) => {
  try {
    const created = await prisma.currency.create({
      data: currency,
    });
    return {
      success: true,
      data: created,
    };
  } catch (error) {
    logger.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        success: false,
        error: {
          code: "DUPLICATE_CODE",
          message: "Currency code already exists",
        },
      };
    }
    return {
      success: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: "Failed to create currency",
      },
    };
  } finally {
    await prisma.$disconnect();
  }
};
export const editCurrencyService = async ({ id, currency }: { id: number, currency: Omit<currency, "id" | "deletedAt"> }) => {
  try {
    await prisma.currency.update({
      where: { id },
      data: currency,
    });
    return {
      status: "success",
      message: " currency edit  successfully.",
    };
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to edit currency");
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteCurrencyService = async ({ id, currency }: { id: number, currency: Pick<currency, "deletedAt"> }) => {
  try {
    await prisma.currency.update({
      where: { id },
      data: currency,
    });
    return {
      status: "success",
      message: "delete currency  successfully.",
    };
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to delete currency");
  } finally {
    await prisma.$disconnect();
  }
};

export const getAggregationCurrencyServices = async (req: Request) => {
  const whereClause = buildCurrencyAggregationWhereClause(req);
  try {
    const [activeCurrencyCount] = await Promise.all([
      prisma.currency.count({ where: whereClause }),
    ]);
    return {
      result: {
        activeCurrencyCount,
      },
    };
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

