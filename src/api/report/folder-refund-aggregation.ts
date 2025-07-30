import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { responseError } from "../lib";

export const getFolderRefundAggregationController = async (req: Request, res: Response) => {
  try {
    const result = await getFolderRefundAggregationService();
    res.json({
      status: "ok",
      message: "success",
      result,
    });
  } catch (error) {
    responseError({ error, res });
  }
};

const getFolderRefundAggregationService = async () => {
  const rawData = await prisma.$queryRaw<
    Array<{
      folderId: number;
      folderName: string;
      folderCode: string | null;
      folderStatus: string;
      officeId: number | null;
      priceId: number | null;
      priceCode: string | null;
      priceValue: string;
      priceType: string | null;
      totalAvailable: string;
      totalUnavailable: string;
      totalRefund: string;
    }>
  >`
    SELECT
      f.id AS "folderId",
      f.name AS "folderName",
      f.code AS "folderCode",
      f.status AS "folderStatus",
      f."officeId" AS "officeId",
      p.id AS "priceId",
      p.code AS "priceCode",
      p.price AS "priceValue",
      p.type AS "priceType",
      COUNT(*) FILTER (WHERE n."isAvailable" = true) AS "totalAvailable",
      COUNT(*) FILTER (WHERE n."isAvailable" = false) AS "totalUnavailable",
      SUM(p.price) FILTER (WHERE n."isAvailable" = true) AS "totalRefund"
    FROM "folder" f
    LEFT JOIN "number" n ON n."folderId" = f.id
    LEFT JOIN "price" p ON n."priceId" = p.id
    WHERE f.status = 'IN_PRODUCTION'
    AND NOT EXISTS (
      SELECT 1 FROM "refund" r WHERE r."folderId" = f.id
    )
    AND p.id IS NOT NULL
    GROUP BY f.id, f.name, f.code, f.status, f."officeId", p.id, p.code, p.price, p.type
    ORDER BY f.id;
  `;

  const folderMap: Record<number, any> = {};

  for (const row of rawData) {
    const folderId = row.folderId;
    if (!folderMap[folderId]) {
      folderMap[folderId] = {
        id: folderId,
        name: row.folderName,
        code: row.folderCode,
        status: row.folderStatus,
        officeId: row.officeId,
        refundDetail: [],
        totalFormReject: 0,
        totalUnavailable: 0,
        totalRefund: 0,
        sumTotalForm: 0,
      };
    }
    if (row.priceId) {
      const formRejectCount = Number(row.totalAvailable);
      const unavailable = Number(row.totalUnavailable);
      const refundValue = Number(row.totalRefund);
      folderMap[folderId].refundDetail.push({
        id: row.priceId,
        code: row.priceCode,
        price: Number(row.priceValue),
        type: row.priceType,
        totalFormReject: formRejectCount,
        totalUnavailable: unavailable,
        totalRefund: refundValue,
      });
      folderMap[folderId].totalFormReject += formRejectCount;
      folderMap[folderId].totalUnavailable += unavailable;
      folderMap[folderId].totalRefund += refundValue;
      folderMap[folderId].sumTotalForm = folderMap[folderId].totalFormReject + folderMap[folderId].totalUnavailable;
    }
  }
  return Object.values(folderMap);
};

export default getFolderRefundAggregationController;

