import { ActionType, Prisma, user } from "@prisma/client";
import { Request } from "express";
import { addIndexToResults } from "../../utils/addIndexToResults";
import {
  PaginateCalucations,
  validatePaginationParams,
} from "../../utils/pagination";

import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma";
import { buildWhereClause } from "./lib";

export const getAllUserService = async (req: Request) => {
  try {
    const { search = "" } = req.query;
    const paginationParams = validatePaginationParams(req);
    const { page, limit, paginate } = paginationParams;
    const whereClause = buildWhereClause({ search });
    const queryFn = async (skip: number, take: number) => {
      const data = await prisma.user.findMany({
        skip,
        take,
        orderBy: { id: "desc" },
        where: whereClause,
        include: {
          office: true,
          userOffice: {
            select: {
              id: true,
              office: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      const totalCount = await prisma.user.count({ where: whereClause });
      return [data, totalCount];
    };
    const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
    const dataWithIndex = addIndexToResults(
      paginationResult.result,
      page,
      limit,
    );
    return {
      ...paginationResult,
      result: dataWithIndex,
    };
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const getUserLogService = async (req: Request) => {
  const paginationParams = validatePaginationParams(req);
  const { userId, action } = req.query;
  const { page, limit, paginate } = paginationParams;
  const queryFn = async (skip: number, take: number) => {
    const where: Record<string, any> = {};
    if (userId) {
      where.userId = Number(userId);
    }
    if (action) {
      where.action = action;
    }
    const data = await prisma.userLog.findMany({ where, skip, take, orderBy: { id: "desc" } });
    const totalCount = await prisma.userLog.count({ where });
    return [data, totalCount];
  };
  const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
  const dataWithIndex = addIndexToResults(paginationResult.result, page, limit);
  return {
    ...paginationResult,
    result: dataWithIndex,
  };
};

export const getOneUserServicer = async ({ id }: { id: number }) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
      include: {
        userOffice: true,
      },
    });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    const newUser = {
      ...user,
    };
    return {
      success: true,
      result: newUser,
    };
  } catch {
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const createUserServicer = async (user: Omit<user, "id">, tx: Prisma.TransactionClient) => {
  try {
    const result = await tx.user.create({ data: user });
    return result;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const findUserServicer = async (phone: string, tx: Prisma.TransactionClient) => {
  try {
    const result = await tx.user.findFirst({
      where: { phone },
      select: {
        phone: true,
        id: true,
      },
    });

    return result;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

export const updateUserAccountService = async ({
  id,
  data,
  tx,
}: {
  id: number;
  data: any;
  tx: Prisma.TransactionClient
}) => {
  try {
    const result = await tx.user.update({
      where: { id },
      data,
    });
    return result;
  } catch {
    return null;
  }
};

export const handleError = (error: unknown, contextMessage: string) => {
  if (error instanceof Error) {
    logger.error(`${contextMessage}: ${error.message}`);
  } else {
    logger.error(`${contextMessage}: An unknown error occurred.`);
  }
};

export const safelyDisconnectPrisma = async () => {
  try {
    await prisma.$disconnect();
  } catch (disconnectError) {
    logger.error(`Error disconnecting from database: ${disconnectError}`);
  }
};

export const findOneUserServicer = async (username: string) => {
  try {
    const result = await prisma.user.findFirst({
      where: {
        username,
      },
      include: {
        userOffice: {
          select: {
            officeId: true,
          },
        },
      },
    });
    return result;
  } catch {
    return null;
  } finally {
    await prisma.$disconnect();
  }
};

export const getAggregationUserListServices = async () => {
  try {
    const [activeUsers, inactiveUsers, totalCount] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.count(),
    ]);
    return {
      result: {
        activeUsers,
        inactiveUsers,
        totalCount,
      },
    };
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const createUserLogService = async ({
  action,
  data,
  changes,
  changedBy,
  tx,
}: {
  action: ActionType;
  data: Record<string, any>;
  changes?: Record<string, any>;
  changedBy: number;
  tx: Prisma.TransactionClient
}) => {
  try {
    const result = {
      userId: data.id,
      action,
      changedBy,
      oldEmail: action === ActionType.CREATE ? null : data.email ?? null,
      newEmail: action === ActionType.CREATE ? data.email ?? null : changes?.email ?? null,
      oldPhone: action === ActionType.CREATE ? null : data.phone ?? null,
      newPhone: action === ActionType.CREATE ? data.phone ?? null : changes?.phone ?? null,
      oldRole: action === ActionType.CREATE ? null : data.role ?? null,
      newRole: action === ActionType.CREATE ? data.role ?? null : changes?.role ?? null,
    };
    return await tx.userLog.create({ data: result });
  } catch (error) {
    throw error;
  }
};
