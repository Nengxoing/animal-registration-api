import { Prisma } from "@prisma/client";

export interface NumberFolderAggregationRecord {
    number: {
      id: number;
      number: string;
    };
    price: {
      id: number;
      price: Prisma.Decimal;
      code: string | null;
      type: string;
    } | null;
    folder: {
      id: number;
      name: string;
      status: string;
    } | null;
  }

export interface PaginatedResponse<T> {
    meta: {
      isFirstPage: boolean;
      isLastPage: boolean;
      currentPage: number;
      previousPage: number | null;
      nextPage: number | null;
      pageCount: number;
      totalCount: number;
    };
    result: T[];
  }
