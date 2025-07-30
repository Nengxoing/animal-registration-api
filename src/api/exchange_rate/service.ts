import { exchangeRate } from "@prisma/client";
import { Request } from "express";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { getImagePath } from "../../utils/fileUrl";
import { PaginateCalucations, validatePaginationParams } from "../../utils/pagination";
import { buildExchangeRateAggregationWhereClause, buildExchangeRateWhereClause } from "./lib";

export const getAllExchangeRateService = async (req: Request) => {
  try {
    const paginationParams = validatePaginationParams(req);
    const { page, limit, paginate } = paginationParams;
    const whereClause = buildExchangeRateWhereClause(req);
    const queryFn = async (skip: number, take: number) => {
      const data = await prisma.exchangeRate.findMany({
        skip,
        take,
        orderBy: { id: "desc" },
        where: whereClause,
        include: {
          baseCurrency: true,
          targetCurrency: true,
        },
      });
      const totalCount = await prisma.exchangeRate.count({ where: whereClause });
      return [data, totalCount];
    };

    const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
    const dataWithIndex = addIndexToResults(paginationResult.result, page, limit);
    return {
      ...paginationResult,
      result: dataWithIndex,
    };
  } catch (error) {
    logger.error("Error in getAllExchangeRateService:", error);
    throw new Error("Failed to retrieve exchange rates.");
  } finally {
    await prisma.$disconnect();
  }
};

export const getOneExchangeRateService = async ({ id, req }: { id: number | string, req: Request }) => {
  try {
    const exchangeRateId = Number(id);
    if (isNaN(exchangeRateId)) {
      throw new Error("Invalid exchangeRate ID. ID must be a number.");
    }
    const data = await prisma.exchangeRate.findUnique({
      where: { id: exchangeRateId },
      include: {
        baseCurrency: true,
        targetCurrency: true,
      },
    });
    if (!data) {
      throw new Error(`ExchangeRate with ID ${exchangeRateId} not found.`);
    }
    const dataWithImagePath = getImagePath({ req, data, field: "image" });
    return {
      success: true,
      message: "Exchange rate retrieved successfully.",
      result: dataWithImagePath,
    };
  } catch (error) {
    logger.info("Error in getOneExchangeRateService:", error);
    throw new Error("Failed to retrieve exchange rate.");
  } finally {
    await prisma.$disconnect();
  }
};
export const createExchangeRateService = async (exchangeRate: Omit<exchangeRate, "id">) => {
  try {
    const created = await prisma.exchangeRate.create({
      data: exchangeRate,
    });
    return { success: true, data: created };
  } catch (error) {
    logger.info("❌ Error in createExchangeRateService:", error);
    throw new Error("Database error: Failed to create ExchangeRate");
  }
  finally {
    await prisma.$disconnect();
  }
};

export const editExchangeRateService = async ({ id, exchangeRate }: { id: number, exchangeRate: Omit<exchangeRate, "id" | "deletedAt"> }) => {
  try {
    await prisma.exchangeRate.update({
      where: { id },
      data: exchangeRate,
    });

    return {
      success: true,
      message: "Exchange rate updated successfully.",
    };
  } catch (error) {
    logger.error("Error in editExchangeRateService:", error);
    throw new Error("Failed to update exchange rate.");
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteExchangeRateService = async ({ id, exchangeRate }: { id: number, exchangeRate: Pick<exchangeRate, "deletedAt"> }) => {
  try {
    await prisma.exchangeRate.update({
      where: { id },
      data: exchangeRate,
    });
    return {
      success: true,
      message: "Exchange rate deleted successfully.",
    };
  } catch (error) {
    logger.error("Error in deleteExchangeRateService:", error);
    throw new Error("Failed to delete exchange rate.");
  } finally {
    await prisma.$disconnect();
  }
};

export const getAggregationExchangeRateServices = async (req: Request) => {
  const whereClause = buildExchangeRateAggregationWhereClause(req);
  try {
    const activeExchangeRateCount = await prisma.exchangeRate.count({ where: whereClause });
    return {
      success: true,
      message: "Exchange rate aggregation retrieved successfully.",
      data: { activeExchangeRateCount },
    };
  } catch (error) {
    logger.error("Error in getAggregationExchangeRateServices:", error);
    throw new Error("Failed to retrieve exchange rate aggregation.");
  } finally {
    await prisma.$disconnect();
  }
};
