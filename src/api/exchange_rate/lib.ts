import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { Request } from "express";
import { parseBooleanOrUndefined } from "../../utils/booleanParser";

export const buildExchangeRateWhereClause = (req: Request) => {
  const { officeId, officeIds, search, status } = req.query;
  const where: Prisma.exchangeRateWhereInput = {
    deletedAt: null,
  };
  const searchTerm = typeof search === "string" ? search : "";
  if (search) {
    where.OR = [
      { baseCurrency: { name: { contains: searchTerm, mode: "insensitive" } } },
      { baseCurrency: { code: { contains: searchTerm, mode: "insensitive" } } },
      { targetCurrency: { name: { contains: searchTerm, mode: "insensitive" } } },
      { targetCurrency: { code: { contains: searchTerm, mode: "insensitive" } } },
    ];
  }
  const officeIdsList = officeIds ? String(officeIds).split(",").map(Number) : [];
  if (officeIdsList.length > 0) {
    where.officeId = { in: officeIdsList };
  } else if (officeId) {
    where.officeId = Number(officeId);
  }
  const parsedStatus = parseBooleanOrUndefined(status);
  if (parsedStatus !== undefined) {
    where.status = parsedStatus;
  }
  return where;
};

export const buildExchangeRateAggregationWhereClause = (req: Request) => {
  const { officeId, officeIds } = req.query;
  const where: Prisma.exchangeRateWhereInput = {
    deletedAt: null,
  };
  const officeIdsList = officeIds ? String(officeIds).split(",").map(Number) : [];
  if (officeIdsList.length > 0) {
    where.officeId = { in: officeIdsList };
  } else if (officeId) {
    where.officeId = Number(officeId);
  }
  return where;
};
const DECIMAL_PRECISION = 3;
export function buildExchangeRateCreateRecord(req: Request) {
  const { baseCurrencyId, targetCurrencyId, rateBase, startDate, endDate, type, status, ratePolice, name } = req.body;
  return {
    baseCurrencyId: parseInt(baseCurrencyId, 10),
    targetCurrencyId: parseInt(targetCurrencyId, 10),
    rateBase: new Decimal(rateBase).toFixed(DECIMAL_PRECISION),
    ratePolice: new Decimal(ratePolice).toFixed(DECIMAL_PRECISION),
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    type,
    updatedAt: new Date(),
    status: Boolean(status),
    name: String(name),
  };
}
