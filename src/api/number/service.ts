import { prisma } from "../../prisma/index";
import { addIndexToResults } from "../../utils/addIndexToResults";
import { PaginateCalucations } from "../../utils/pagination";

export const getAllNumberService = async ({
  page,
  limit,
  paginate,
  folderId,
  isAvailable,
}: {
  page: number;
  limit: number;
  paginate?: boolean;
  folderId?: number;
  isAvailable?: any;
}) => {
  const queryFn = async (skip: number, take: number) => {
    const whereCondition: any = { folderId };
    if (isAvailable !== undefined) {
      const isAvailableTrue = isAvailable === "true";
      const isAvailableFalse = isAvailable === "false";
      if (isAvailableTrue) {
        whereCondition.isAvailable = true;
      } else if (isAvailableFalse) {
        whereCondition.isAvailable = false;
      } else {
        whereCondition.isAvailable = undefined;
      }
    }
    const data = await prisma.number.findMany({
      skip,
      take,
      orderBy: { id: "asc" },
      select: {
        id: true,
        number: true,
        isAvailable: true,
        price: { select: { id: true, name: true, price: true, type: true, code: true, duration: true } },
      },
      where: whereCondition,
    });

    const totalCount = await prisma.number.count({
      where: whereCondition,
    });
    return [data, totalCount];
  };
  const paginationResult = await PaginateCalucations({ page, limit, queryFn, paginate });
  const dataWithIndex = addIndexToResults(paginationResult.result, page, limit);
  const newResult = dataWithIndex.map((item) => {
    const type = item.price.type  ==="BLUE" ? "ບັດຟ້າ" : "ບັດເຫຼືອງ";
    return {
      id: item.id,
      duration: item.price?.duration,
      number: `${item.number} - ${type} (${item.price?.code || ""})`,
    };
  });
  return {
    ...paginationResult,
    result: newResult,
  };
};
