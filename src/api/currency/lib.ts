import { Prisma } from "@prisma/client";
import { Request } from "express";

export const buildCurrencyWhereClause = (req: Request) => {
  const { search, officeId, officeIds } = req.query;
  const where: Prisma.currencyWhereInput = {
    deletedAt: null,
  };
  if (search) {
    where.OR = [{ name: { contains: search as string, mode: "insensitive" } }];
  }
  const officeIdsList = officeIds ? String(officeIds).split(",").map(Number) : [];
  if (officeIdsList.length > 0) {
    where.officeId = { in: officeIdsList };
  } else if (officeId) {
    where.officeId = Number(officeId);
  }
  return where;
};

export const buildCurrencyAggregationWhereClause = (req: Request) => {
  const { officeId, officeIds } = req.query;
  const where: Prisma.currencyWhereInput = {
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