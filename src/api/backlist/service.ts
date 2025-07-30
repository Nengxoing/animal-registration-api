 
import { blacklist, Prisma } from "@prisma/client";
import { Request } from "express";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { PaginateCalucations, validatePaginationParams } from "../../utils/pagination";

export const getBlacklistedCompanysService = async (req: Request) => {
  const paginationParams = validatePaginationParams(req);
  const { page, limit, paginate } = paginationParams;
  // const { search, gender, officeId } = req.query;
  try {
    const whereClause: Prisma.blacklistWhereInput = {
      
    };
    const queryFn = async (skip: number, take: number) => {
      const data = await prisma.blacklist.findMany({
        skip,
        take,
        where: whereClause,
        include: {
          company: true,
        },
        orderBy: { createdAt: "desc" },
        
      });
      const totalCount = await prisma.blacklist.count({
        where: whereClause,
      });
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
    logger.error(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export const getCheckBlacklistAndExistService = async ({
  req,
}: {
  req: Request;
}) => {
  const { name, businessCode, businessType } = req.query;
  validateInput( name as string, businessCode as string, businessType as string);
  try {
    const blacklistedCompany = await checkBlacklist(name as string, businessCode as string, businessType as string);
    if (blacklistedCompany) {
      return { status: "blacklisted", message: "ບຸກຄົນນີຖືກຂຶ້ນບັນຊິດໍາ" };
    }
    return {
      status: "ok",
      message: "No matching company found in the database.",
    };
  } catch {
    throw new Error("Failed to fetch application requests");
  }
};

// const checkcompanyExistence = async (
//   firstName: string,
//   lastName: string,
//   year: number,
//   month: number,
//   day: number,
// ) => {
//   return await prisma.company.findFirst({
//     where: {
//       firstName: { equals: firstName.trim(), mode: "insensitive" },
//       lastName: { equals: lastName.trim(), mode: "insensitive" },
//       dateOfBirth: {
//         gte: new Date(Date.UTC(year, month, day, 0, 0, 0, 0)),
//         lt: new Date(Date.UTC(year, month, day + 1, 0, 0, 0, 0)),
//       },
//     },
//   });
// };

const checkBlacklist = async (
  name: string,
  businessCode: string,
  businessType: string,
) => {
  return await prisma.company.findFirst({
    where: {
      name: { equals: name.trim(), mode: "insensitive" },
      businessCode: { equals: businessCode.trim(), mode: "insensitive" },
      businessType: { equals: businessType.trim(), mode: "insensitive" },
      
    },
  });
};

// const parseDateOfBirth = (
//   dateOfBirth: string,
// ): { year: number; month: number; day: number } => {
//   const parsedDate = new Date(dateOfBirth);
//   return {
//     year: parsedDate.getUTCFullYear(),
//     month: parsedDate.getUTCMonth(),
//     day: parsedDate.getUTCDate(),
//   };
// };

const validateInput = (
  name: string,
  businessCode: string,
  businessType: string,
): void => {
  if (
    !name ||
    !businessCode ||
    !businessType ||
    !name.trim() ||
    !businessCode.trim() ||
    !businessType.trim()
  ) {
    throw new Error(
      "Missing required fields: firstName, lastName, identityNumber, or dateOfBirth.",
    );
  }
};

export const createBlacklistService = async (
  blacklist: Omit<blacklist, "id">,
) => {
  try {
    const createdBlacklist = await prisma.blacklist.create({
      data: blacklist,
    });
    return createdBlacklist;
  } catch (error) {
    logger.error(error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
};