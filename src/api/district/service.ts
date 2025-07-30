import { district } from "@prisma/client";
import logger from "../../middleware/logger/config";
import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { PaginateCalucations } from "../../utils/pagination";

export const getAllDistrictService = async ({
  page,
  limit,
  search,
  provinceId,
  paginate,
}: {
  page: number;
  limit: number;
  search?: any;
  provinceId?: number;
  paginate?: boolean;
}) => {
  const whereClause = buildWhereClause({ search, provinceId });
  const queryFn = async (skip: number, take: number) => {
    const data = await prisma.district.findMany({
      skip,
      take,
      orderBy: { id: "desc" },
      where: whereClause,
      include: {
        province: true,
      },
    });
    const totalCount = await prisma.district.count({
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
  provinceId,
}: {
  search?: string;
  provinceId?: number;
}) => {
  const whereClause: any = {};
  if (search) {
    whereClause.OR = [
      { districtLao: { contains: search, mode: "insensitive" } },
      { districtEnglish: { contains: search, mode: "insensitive" } },
    ];
  }
  if (provinceId) {
    whereClause.provinceId = provinceId;
  }
  return whereClause;
};

export const getOneDistrictService = async ({ id }: { id: number }) => {
  try {
    const data = await prisma.district.findUnique({
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

const isDistrictUnique = async (district: district): Promise<boolean> => {
  const existingDistrict = await prisma.district.findFirst({
    where: {
      districtLao: district.districtLao,
      districtEnglish: district.districtEnglish,
      provinceId: district.provinceId,
    },
  });
  return !existingDistrict;
};

export const createDistrictsService = async (districtsData: district[]) => {
  try {
    if (!Array.isArray(districtsData) || districtsData.length === 0) {
      throw new Error(
        "Invalid input: Expected a non-empty array of districts.",
      );
    }
    const validDistricts = await Promise.all(
      districtsData.map(async (district) =>
        (await isDistrictUnique(district)) ? district : null,
      ),
    ).then((results) => results.filter(Boolean) as district[]);
    if (validDistricts.length === 0) {
      return {
        count: 0,
        message:
          "No new districts to create; all provided data already exists.",
      };
    }
    const createdDistricts = await prisma.district.createMany({
      data: validDistricts,
      skipDuplicates: true,
    });

    return {
      count: createdDistricts.count,
      message: "New districts created successfully.",
    };
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to create districts");
  } finally {
    await prisma.$disconnect();
  }
};

export const editDistrictService = async ({
  data,
  id,
}: {
  data: Omit<district, "id">;
  id: number;
}) => {
  try {
    const editProfileRes = await prisma.district.update({
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

export const aggregationDistrictServices = async () => {
  try {
    const [TotalActive, total] = await Promise.all([
      prisma.district.count({ where: { status: true } }),
      prisma.district.count(),
    ]);
    return { total, TotalActive };
  } catch (error) {
    logger.error("Error in aggregationDistrictServices:", error);
    throw new Error("Failed to aggregate district data");
  } finally {
    await prisma.$disconnect();
  }
};
