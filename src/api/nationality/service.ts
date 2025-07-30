import { nationality } from "@prisma/client";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { PaginateCalucations } from "../../utils/pagination";

export const getAllNationalityService = async ({
  page,
  limit,
  search,
  paginate,
  continent,
  status,
  code,
}: {
  page: number;
  limit: number;
  search?: any;
  paginate?: boolean;
  continent?: any;
  status?: any;
  code?: any;
}) => {
  const whereClause = buildWhereClause({ search, continent, status, code });
  const queryFn = async (skip: number, take: number) => {
    const data = await prisma.nationality.findMany({
      skip,
      take,
      orderBy: { continent: "asc" },
      where: whereClause,
    });
    const totalCount = await prisma.nationality.count({
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

const buildWhereClause = ({
  search,
  continent,
  status,
  code,
}: {
  search?: string;
  continent?: string;
  status?: any;
  code?: any;
}) => {
  const whereClause: any = {};
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { nationality: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
    ];
  }
  if (code) {
    whereClause.code = code;
  }
  if (status !== undefined) {
    const statusTrue = status === "true";
    const statusFalse = status === "false";
    if (statusTrue) {
      whereClause.status = true;
    } else if (statusFalse) {
      whereClause.status = false;
    } else {
      whereClause.status = undefined;
    }
  }
  if (continent) {
    whereClause.continent = continent;
  }
  return whereClause;
};

export const getOneNationalityService = async ({ id }: { id: number }) => {
  try {
    const data = await prisma.nationality.findUnique({
      where: { id: id },
    });
    return {
      result: [data],
    };
  } catch (error) {
    logger.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

const isNationalityUnique = async (
  nationality: nationality,
): Promise<boolean> => {
  const existingNationality = await prisma.nationality.findFirst({
    where: {
      name: nationality.name,
      nationality: nationality.nationality,
      code: nationality.code,
    },
  });
  return !existingNationality;
};

export const createNationalitysService = async (
  nationalitysData: nationality[],
) => {
  try {
    if (!Array.isArray(nationalitysData) || nationalitysData.length === 0) {
      throw new Error(
        "Invalid input: Expected a non-empty array of countries.",
      );
    }
    const validNationalitys = await Promise.all(
      nationalitysData.map(async (nationality) => {
        const isUnique = await isNationalityUnique(nationality);
        return isUnique ? nationality : null;
      }),
    ).then((results) => results.filter(Boolean) as nationality[]);

    if (validNationalitys.length === 0) {
      return {
        count: 0,
        message:
          "No new countries to create; all provided data already exists.",
      };
    }
    const created = await prisma.nationality.createMany({
      data: validNationalitys,
      skipDuplicates: true,
    });

    return {
      count: created.count,
      message: "New countries created successfully.",
    };
  } catch (error) {
    logger.error("Error in createNationalitysService:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create countries",
    );
  } finally {
    await prisma.$disconnect();
  }
};

export const editNationalityService = async ({
  data,
  id,
}: {
  data: Omit<nationality, "id">;
  id: number;
}) => {
  try {
    const editProfileRes = await prisma.nationality.update({
      where: { id },
      data,
    });
    return editProfileRes;
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to edit profile data");
  } finally {
    await prisma.$disconnect();
  }
};

export const aggregationNationalityServices = async () => {
  try {
    const [TotalActive, total] = await Promise.all([
      prisma.nationality.count({ where: { status: true } }),
      prisma.nationality.count(),
    ]);
    return { total, TotalActive };
  } catch (error) {
    logger.error("Error in aggregationnationalityServices:", error);
    throw new Error("Failed to aggregate nationality data");
  } finally {
    await prisma.$disconnect();
  }
};
