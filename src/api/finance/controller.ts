/* eslint-disable no-magic-numbers */
 
/* eslint-disable max-nested-callbacks */
import { finance, PaymentMethod } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { processFileUrl } from "../../utils/fileUrl";
import { dataTokenPayload } from "../../utils/lib";
import { getNumber } from "../folder/lib";
import { getAllFinanceService } from "./service";

export const createFinanceController = async (req: Request, res: Response) => {
  try {
    const transactionResult = await createFinanceService(req, res);
    res.status(transactionResult.status).json(transactionResult.body);
  } catch (error: any) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: error.message || "An unexpected error occurred",
    });
  }
};

const createFinanceService = async (req: Request, res: Response) => {
  const userPayload = dataTokenPayload(req, res);
  const officeId = userPayload.officeId;
  return prisma.$transaction(async (tx) => {
    const startNumber = await getNumber(tx, officeId);
    const folder = await tx.folder.findUnique({
      where: { id: Number(req.body.folderId) },
      include: { folderPrice: true },
    });
    if (!folder) {
      throw new Error("Folder not found");
    }
    const folderId = folder.id;
    const exchangeRateRecord: finance = buildFinanceCreateRecord(req, folderId, res);
    const createdFinance = await tx.finance.create({ data: exchangeRateRecord });
    let currentSeq = BigInt(startNumber);
    const generatedNumbers = folder.folderPrice.flatMap(({ priceId, amount }) => {
      const numericAmount = Number(amount);
      return Array.from({ length: numericAmount }, () => {
        const seq = currentSeq % BigInt(1000000);
        const seqStr = seq.toString().padStart(6, "0");
        currentSeq += BigInt(1);
        return {
          number: seqStr,
          priceId,
          folderId: folder.id,
          officeId: officeId,
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });
    });
    await tx.number.createMany({ data: generatedNumbers });
    return {
      status: StatusCodes.CREATED,
      body: {
        status: "success",
        message: "Finance record and number list created successfully",
        finance: createdFinance,
        numbers: generatedNumbers.map((n) => n.number),
      },
    };
  });
};

function buildFinanceCreateRecord(req: Request, folderId: number, res: Response): any {
  const { rateBase, ratePolice, exchangeRateId, amount } = req.body;
  const parsedAmount = amount && !isNaN(Number(amount)) ? new Decimal(amount) : new Decimal(0);
  const parsedRateBase = rateBase && !isNaN(Number(rateBase)) ? new Decimal(rateBase) : new Decimal(0);
  const parsedRatePolice = ratePolice && !isNaN(Number(ratePolice)) ? new Decimal(ratePolice) : new Decimal(0);
  let newExchangeRateId: number | null = exchangeRateId ? Number(exchangeRateId) : null;
  if (!newExchangeRateId || newExchangeRateId <= 0 || Number.isNaN(newExchangeRateId)) {
    newExchangeRateId = null;
  }
  const userPayload = dataTokenPayload(req, res);
  const image = processFileUrl(req, "receiptImage");
  const receiptImage = typeof image === "string" ? image : null;
  const officeId = userPayload.officeId;
  return {
    approvedById: userPayload.id,
    folderId: folderId,
    amount: parsedAmount,
    receiptImage: receiptImage,
    exchangeRateId: newExchangeRateId,
    rateBase: parsedRateBase,
    ratePolice: parsedRatePolice,
    paymentMethod: req.body.paymentMethod ?? PaymentMethod.CASH,
    receiptNumber: req.body.receiptNumber ?? null,
    officeId: officeId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export const getAllFinanceController = async (req: Request, res: Response) => {
  try {
    const result = await getAllFinanceService(req);
    res.json({
      status: "ok",
      message: "success",
      ...result,
    });
  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch finance",
    });
  }
};
