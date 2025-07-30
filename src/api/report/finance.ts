import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { responseError } from "../lib";

export const getFinanceAggregationController = async (req: Request, res: Response) => {
  try {
    const officeIdsParam = req.query.officeIds as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const officeIds = officeIdsParam.split(",").map(Number);
    const aggregation = await getFinanceAggregationService({ officeIds, startDate, endDate });
    res.json({
      status: "ok",
      result: aggregation,
    });
  } catch (error) {
    responseError({ error, res });
  }
};

interface AggregationParams {
  officeIds: number[];
  startDate: string;
  endDate: string;
}

const getFinanceAggregationService = async ({ officeIds, startDate, endDate }: AggregationParams) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const aggregatedFinances = await prisma.$queryRaw<
      {
        id: number;
        fullname: string;
        number: string;
        createdAt: Date;
        currencyName: string;
        currencyCode: string;
        exchangeRateId: number;
      }[]
    >`
      SELECT
        MIN(f.id) as id,
        (
          SELECT CONCAT(p."firstName", ' ', p."lastName")
          FROM "application" a
          JOIN "profile" p ON a."profileId" = p.id
          WHERE a."folderId" = f."folderId"
          LIMIT 1
        ) as fullname,
        (
          SELECT n.number
          FROM "number" n
          WHERE n."folderId" = f."folderId"
          LIMIT 1
        ) as number,
        MIN(f."createdAt") as "createdAt",
        c.name as "currencyName",
        c.code as "currencyCode",
        f."exchangeRateId"
      FROM "finance" f
      LEFT JOIN "exchangeRate" er ON f."exchangeRateId" = er.id
      LEFT JOIN "currency" c ON er."baseCurrencyId" = c.id
      WHERE
        f."officeId" IN (${Prisma.join(officeIds)}) AND
        f."createdAt" BETWEEN ${start} AND ${end}
      GROUP BY f."exchangeRateId", c.name, c.code, f."folderId"
      ORDER BY MIN(f."createdAt") ASC;
    `;
    await prisma.$disconnect();
    return aggregatedFinances;
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
};
