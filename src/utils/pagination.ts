import { Request } from "express";

export const PaginateCalucations = async ({
  page,
  limit,
  queryFn,
  paginate = false,
}: {
  page: number;
  limit: number;
  queryFn: any;
  paginate?: boolean;
}) => {
  if (!paginate) {
    const [data, totalCount] = await queryFn(0, Number.MAX_SAFE_INTEGER);
    return {
      meta: {
        isFirstPage: true,
        isLastPage: true,
        currentPage: 1,
        previousPage: null,
        nextPage: null,
        pageCount: 1,
        totalCount,
      },
      result: data,
    };
  }
  const skip = (page - 1) * limit;
  const take = limit;
  const [data, totalCount] = await queryFn(skip, take);
  const totalPages = Math.ceil(totalCount / limit);

  return {
    meta: {
      isFirstPage: page === 1,
      isLastPage: page === totalPages,
      currentPage: page,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      pageCount: totalPages,
      totalCount,
    },
    result: data,
  };
};

export const validatePaginationParams = (req: Request) => {
  const { page = 1, limit = 10 } = req.query;
  if (
    !Number.isInteger(+page) ||
    !Number.isInteger(+limit) ||
    +page <= 0 ||
    +limit <= 0
  ) {
    throw new Error("Invalid pagination parameters");
  }
  const paginate = !req.query.paginate;
  return { page: +page, limit: +limit, paginate };
};
