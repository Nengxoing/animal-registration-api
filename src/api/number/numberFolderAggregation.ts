/* eslint-disable max-params */
import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma";
import { PaginateCalucations, validatePaginationParams } from "../../utils/pagination";
import { NumberFolderAggregationRecord, PaginatedResponse } from "./type";

export const getNumberFolderAggregationService = async (
  skip: number,
  take: number,
  officeId?: number,
  folderId?: number,
  numberId?: number,
): Promise<[NumberFolderAggregationRecord[], number]> => {
  const whereCondition: any = {
    isAvailable: true,
    refund: { none: {} },
    folder: {
      status: "POLICE_UNDER_REVIEW",
    },
  };

  if (officeId) {
    whereCondition.officeId = officeId;
  }

  if (folderId) {
    whereCondition.folder.id = folderId;
  }

  if (numberId) {
    whereCondition.id = numberId;
  }

  const [records, totalCount] = await Promise.all([
    prisma.number.findMany({
      where: whereCondition,
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            status: true,
            officeId: true,
            code: true,
          },
        },
        price: {
          select: {
            id: true,
            price: true,
            code: true,
            type: true,
          },
        },
      },
      orderBy: {
        folder: {
          id: "asc",
        },
      },
      skip,
      take,
    }) as unknown as Array<{
      id: number;
      number: string;
      folder: { id: number; name: string; status: string } | null;
      price: { id: number; price: Prisma.Decimal; code: string | null; type: string } | null;
    }>,
    prisma.number.count({
      where: whereCondition,
    }),
  ]);

  const formattedRecords: NumberFolderAggregationRecord[] = records.map((item) => ({
    number: {
      id: item.id,
      number: item.number,
    },
    price: item.price,
    folder: item.folder,
  }));
  return [formattedRecords, totalCount];
};

export const getNumberFolderAggregationPaginated = async (
  req: any,
): Promise<PaginatedResponse<NumberFolderAggregationRecord>> => {
  const { page, limit, paginate } = validatePaginationParams(req);
  const officeId = req.query.officeId ? parseInt(req.query.officeId, 10) : undefined;
  const folderId = req.query.folderId ? parseInt(req.query.folderId, 10) : undefined;
  const numberId = req.query.numberId ? parseInt(req.query.numberId, 10) : undefined;

  const queryFn = async (skip: number, take: number) => {
    return await getNumberFolderAggregationService(skip, take, officeId, folderId, numberId);
  };
  return await PaginateCalucations({ page, limit, queryFn, paginate });
};
