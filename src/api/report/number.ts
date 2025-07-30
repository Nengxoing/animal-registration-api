import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { responseError } from "../lib";
import { format } from "date-fns";

export const getNumberAggregationController = async (req: Request, res: Response) => {
  try {
    const officeIdsParam = req.query.officeIds as string;
    const createdAt = req.query.createdAt as string;
    const officeIds = officeIdsParam.split(",").map(Number);
    const aggregation = await getNumberAggregationService({ officeIds, createdAt });

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
  createdAt: string;
}
const RATE_MULTIPLIER = 1000; 
export const getNumberAggregationService = async ({ officeIds, createdAt }: AggregationParams) => {
  const date = new Date(createdAt);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid createdAt date format");
  }
  date.setHours(0, 0, 0, 0);
  try {
    const rawData = await prisma.$queryRaw<
      {
        id: number;
        number: string;
        createdAt: Date;
        pricePrice: string | null;
        priceCode: string | null;
        priceDuration: string | null;
        approvedByFirstName: string | null;
        rateBase: string | null;
        ratePolice: string | null;
        currencyName: string | null;
        currencyCode: string | null;
        currencySymbol: string | null;
        officeName: string | null;
        folderCode: string | null;
      }[]
    >`
      SELECT
        n.id,
        n.number,
        n."createdAt",
        MIN(p.price) as "pricePrice",
        MIN(p.code) as "priceCode",
        MIN(p.duration) as "priceDuration",
        MIN(u."firstName") as "approvedByFirstName",
        MIN(f."rateBase") as "rateBase",
        MIN(f."ratePolice") as "ratePolice",
        MIN(tcurr.name) as "currencyName",
        MIN(tcurr.code) as "currencyCode",
        MIN(tcurr.symbol) as "currencySymbol",
        MIN(o.name) as "officeName",
        MIN(fold."code") as "folderCode"
      FROM "number" n
      LEFT JOIN "price" p ON n."priceId" = p.id
      LEFT JOIN "finance" f ON n."folderId" = f."folderId"
      LEFT JOIN "user" u ON f."approvedById" = u.id
      LEFT JOIN "exchangeRate" er ON f."exchangeRateId" = er.id
      LEFT JOIN "currency" tcurr ON er."targetCurrencyId" = tcurr.id
      LEFT JOIN "office" o ON n."officeId" = o.id
      LEFT JOIN "folder" fold ON n."folderId" = fold.id
      WHERE
        n."officeId" IN (${Prisma.join(officeIds)})
        AND DATE(n."createdAt" AT TIME ZONE 'Asia/Bangkok') = DATE(${date})
      GROUP BY n.id, n.number, n."createdAt"
      ORDER BY n."createdAt" ASC;
    `;

    const formattedData = rawData.map((item, index) => {
      const createdAtFormatted = format(new Date(item.createdAt), "dd/MM/yyyy");
      const numericPricePrice = item.pricePrice ? parseFloat(item.pricePrice) : 0;
      const numericRateBase = item.rateBase ? Math.floor(parseFloat(item.rateBase) * RATE_MULTIPLIER) : 0;
      const computedPriceRaw = numericRateBase > 0 ? numericPricePrice * numericRateBase : numericPricePrice;
      // eslint-disable-next-line no-magic-numbers
      const computedPrice = computedPriceRaw / 1000; 
      const currencyCode = item.currencyCode?.trim() || "USD";
      const currencyName = item.currencyName?.trim() || "USD";
      const currencySymbol = item.currencySymbol?.trim() || "$";
      return {
        no: index + 1,
        id: item.id,
        number: item.folderCode + item.number,
        createdAt: createdAtFormatted,
        pricePrice: numericPricePrice,
        priceCode: item.priceCode ?? "",
        priceDuration: item.priceDuration ?? "",
        approvedByFirstName: item.approvedByFirstName ?? "",
        rateBase: item.rateBase,
        ratePolice: parseFloat(item.ratePolice ?? "0"),
        currencyName,
        currencyCode,
        currencySymbol,
        targetCurrencyName: currencyName,
        price: computedPrice,
        officeName: item.officeName ?? "",
        folderCode: item.folderCode ?? "",
      };
    });

    const groupSums = formattedData.reduce((acc, curr) => {
      const groupKey = curr.currencyCode;
      if (!acc[groupKey]) {
        acc[groupKey] = {
          total: 0,
          currency: {
            code: curr.currencyCode,
            name: curr.currencyName,
            symbol: curr.currencySymbol,
          },
        };
      }
      acc[groupKey].total += curr.price;
      return acc;
    }, {} as Record<string, { total: number; currency: { code: string; name: string; symbol: string } }>);

    const sumArray = Object.values(groupSums).map((group) => ({
      total: Math.round(group.total),
      currency: group.currency,
    }));

    const infoName = formattedData.length > 0
      ? `ສະຫຼຸບ ${formattedData[0].createdAt}  ${[...new Set(formattedData.map((item) => item.officeName))].join(", ")}`
      : "ສະຫຼຸບ";

    return {
      summary: {
        name: infoName,
        sum: sumArray,
      },
      data: formattedData,
    };
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
