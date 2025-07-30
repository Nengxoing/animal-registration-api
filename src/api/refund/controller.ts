import { Decimal } from "@prisma/client/runtime/library";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { getFileUrls, getImagePath } from "../../utils/fileUrl";
import { dataTokenPayload } from "../../utils/lib";
import { PaginateCalucations, validatePaginationParams } from "../../utils/pagination";
import { responseError } from "../lib";
export const createRefundController = async (req: Request, res: Response) => {
  try {
    const { officeId, id: createById } = dataTokenPayload(req, res);
    const imageUrls = getFileUrls(req);

    if (!imageUrls || imageUrls.length === 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "No image files were uploaded.",
      });
      return;
    }
    const { numberId, priceAmount, priceId, profileId, comment } = req.body;
    if (!numberId || !priceAmount || !priceId || !profileId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Missing required fields.",
      });
      return;
    }
    const newRefund = {
      numberId: Number(numberId),
      officeId,
      priceId: Number(priceId),
      createById,
      priceAmount: new Decimal(priceAmount.toString()),
      profileId: Number(profileId),
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      refundImage: {
        create: imageUrls.map((url: string) => ({
          image: url,
        })),
      },
    };

    const refundResult = await createRefundService(newRefund);

    if (!refundResult) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to create refund.",
      });
      return;

    }

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Refund created successfully",
      result: refundResult,
    });
    return;

  } catch (error) {
    return responseError({ res, error });
  }
};

const createRefundService = async (newRefund: any) => {
  try {
    return await prisma.refund.create({ data: newRefund });
  } catch (error) {
    logger.error(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const getAllRefundController = async (req: Request, res: Response) => {
  try {
    const result = await getAllRefundService(req);
    if (!result) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: "Failed to fetch refunds",
      });
      return;
    }
    res.json({
      status: "ok",
      message: "success",
      ...result,
    });
    return;

  } catch (error) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to fetch refunds",
    });
    return;

  }
};

const getAllRefundService = async (req: Request) => {
  const { page, limit, paginate } = validatePaginationParams(req);
  const whereClause = buildWhereClause(req);

  const queryFn = async (skip: number, take: number) => {
    const refunds = await fetchRefunds(skip, take, whereClause);
    const totalCount = await prisma.refund.count({ where: whereClause });
    return [refunds, totalCount];
  };
  const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
  if (!paginationResult?.result) {
    return null;
  }
  const paginationResultWithImage = paginationResult.result.map((item: any) => ({
    ...item,
    refundImage: getImagePath({ req, data: item.refundImage, field: "image" }),
  }));
  const dataWithIndex = addIndexToResults(paginationResultWithImage, page, limit);
  return {
    ...paginationResult,
    result: dataWithIndex,
  };
};

const buildWhereClause = (req: Request) => {
  const { officeId } = req.query;
  const where: any = {};
  if (officeId) {
    where.officeId = Number(officeId);
  }
  return where;
};

const fetchRefunds = async (skip: number, take: number, whereClause: object) => {
  return prisma.refund.findMany({
    skip,
    take,
    orderBy: { id: "desc" },
    where: whereClause,
    select: {
      id: true,
      comment: true,
      officeId: true,
      number: {
        select: {
          number: true,
          folder: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      },
      price: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
      createBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      profile: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      refundImage: {
        select: {
          image: true,
        },
      },
      createdAt: true,
    },
  }) || [];
};
