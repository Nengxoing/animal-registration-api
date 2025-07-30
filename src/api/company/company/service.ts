import { ActionType, company, Prisma } from "@prisma/client";
import { Request } from "express";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { dateTimeFormat } from "../../utils/dateFormat";
import { getImagePath } from "../../utils/fileUrl";
import { PaginateCalucations, validatePaginationParams } from "../../utils/pagination";

export const getAllCompanyService = async ({
  page,
  limit,
  search,
  paginate,
  req,
}: {
  page: number;
  limit: number;
  search?: any;
  paginate?: boolean;
  req: Request;
}) => {
  const whereClause = buildWhereClause({ search });
  const queryFn = async (skip: number, take: number) => {
    const data = await prisma.company.findMany({
      skip,
      take,
      orderBy: { id: "desc" },
      include: {
        companyFile: {
          where: { deletedAt: null },
          select: {
            id: true,
            file: true,
            name: true,
          },
        },
      },
      where: whereClause,
    });
    const totalCount = await prisma.company.count({
      orderBy: { id: "desc" },
    });
    return [data, totalCount];
  };
  const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
  const paginationResultWithImage = paginationResult.result.map((item: any) => ({
    ...item,
    companyFile: getImagePath({ req, data: item.companyFile, field: "file" }),
  }));
  const dataWithIndex = addIndexToResults(paginationResultWithImage, page, limit);
  const formattedDate = formatDate(dataWithIndex);
  return {
    ...paginationResult,
    result: formattedDate,
  };
};

export const getBusinessTypeService = async () => {
  const distinctTypes = await prisma.company.findMany({
    where: {
      businessType: {
        not: null,
      },
    },
    distinct: ["businessType"],
    select: {
      businessType: true,
    },
    orderBy: {
      businessType: "asc",
    },
  });
  return {
    result: distinctTypes,
  };
};

export const getCompanyLogService = async (req: Request) => {
  const paginationParams = validatePaginationParams(req);
  const { companyId, action } = req.query;
  const { page, limit, paginate } = paginationParams;
  const queryFn = async (skip: number, take: number) => {
    const where: Record<string, any> = {};
    if (companyId) {
      where.companyId = Number(companyId);
    }
    if (action) {
      where.action = action;
    }
    const data = await prisma.companyLog.findMany({ where, skip, take, orderBy: { id: "desc" } });
    const totalCount = await prisma.companyLog.count({ where });
    return [data, totalCount];
  };
  const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
  const dataWithIndex = addIndexToResults(paginationResult.result, page, limit);
  return {
    ...paginationResult,
    result: dataWithIndex,
  };
};

const buildWhereClause = ({ search }: any) => {
  const whereClause: any = {};
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { businessCode: { contains: search, mode: "insensitive" } },
    ];
  }
  return whereClause;
};

function formatDate(dataWithIndex: any[]) {
  return dataWithIndex.map((data) => ({
    ...data,
    createdAt: dateTimeFormat(data.createdAt, "DD/MM/YYYY"),
    updatedAt: dateTimeFormat(data.updatedAt, "DD/MM/YYYY"),
  }));
}

export const getOneCompanyService = async ({ id, req }: { id: number, req: Request }) => {
  try {
    const data = await prisma.company.findUnique({
      where: { id: id },
      include: {
        companyFile: {
          where: { deletedAt: null },
          select: {
            id: true,
            file: true,
            name: true,
          },
        },
      },
    });
    const result = {
      ...data,
      companyFile: getImagePath({ req, data: data?.companyFile, field: "file" }),
    };
    return {
      result: result,
    };
  } catch (error) {
    logger.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

export const createCompanyService = async (
  companyData: Omit<company, "id">,
  tx: Prisma.TransactionClient,
) => {
  try {
    const createdCompany = await tx.company.create({
      data: companyData,
    });
    return createdCompany;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

export const editCompanyService = async ({
  data,
  id,
  tx,
}: {
  data: Omit<company, "id">;
  id: number;
  tx: Prisma.TransactionClient
}) => {
  try {
    const editProfileRes = await tx.company.update({
      where: { id },
      data,
    });
    return editProfileRes;
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to edit profile data");
  }
};

export const aggregationCompanyServices = async () => {
  try {
    const [total] = await Promise.all([prisma.company.count()]);
    return { total };
  } catch (error) {
    logger.error("Error in aggregationcompanyServices:", error);
    throw new Error("Failed to aggregate company data");
  } finally {
    await prisma.$disconnect();
  }
};

export const createCompanyLogRecord = async ({ action, data, changes, changedBy, tx }: {
  action: ActionType;
  data: Record<string, any>,
  changes?: Record<string, any>;
  changedBy: number,
  tx: Prisma.TransactionClient
}) => {
  const result = {
    companyId: data.id,
    action,
    changedBy,
    oldName: action === ActionType.CREATE ? null : data.name ?? null,
    newName: action === ActionType.CREATE ? data.name ?? null : changes?.name ?? null,
    oldBusinessCode: action === ActionType.CREATE ? null : data.businessCode ?? null,
    newBusinessCode: action === ActionType.CREATE ? data.businessCode ?? null : changes?.businessCode ?? null,
  };
  await tx.companyLog.create({ data: result });
  return result;
};