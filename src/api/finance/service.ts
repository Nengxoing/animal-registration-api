
import { Prisma } from "@prisma/client";
import { Request } from "express";
import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import {
  PaginateCalucations,
  validatePaginationParams,
} from "../../utils/pagination";

export const getAllFinanceService = async (req: Request) => {
  const paginationParams = validatePaginationParams(req);
  const { page, limit, paginate } = paginationParams;
  const whereClause = buildWhereClause(req);
  const queryFn = async (skip: number, take: number) => {
    const data = await prisma.finance.findMany({
      skip,
      take,
      orderBy: { id: "desc" },
      where: whereClause,
      include: {
        approvedByUser: {
          select: {
            id: true,
            username: true,
            lastName: true,
            firstName: true,
          },
        },
        folder: true,
      },
    });
    const totalCount = await prisma.finance.count({
      orderBy: { createdAt: "desc" },
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

const buildWhereClause = (req: Request): Prisma.financeWhereInput => {
  const { search, officeId } = req.body;
  const whereClause: Prisma.financeWhereInput = {};
  if (search) {
    const searchAmount = new Prisma.Decimal(search);
    whereClause.OR = [
      { amount: { equals: searchAmount } },
    ];
  }
  if (officeId) {
    whereClause.officeId = officeId ? Number(officeId) : null;
  }
  return whereClause;
};