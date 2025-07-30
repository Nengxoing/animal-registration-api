/* eslint-disable max-params */
/* eslint-disable no-magic-numbers */
import { ActionType, price, Prisma, processStatus } from "@prisma/client";

import { Request } from "express";
import { StatusCodes } from "http-status-codes";
export const builderFolderRecord = ({
  folder,
  code,
  officeId,
  changedBy,
  priceData,
}: {
  folder: {
    name: string;
    folderPrice: { amount: number; priceId: number }[];
    billNumber: string,
  };
  code: string;
  officeId: number;
  changedBy: number;
  priceData: price[];
}) => {
  const createFolderPrice = (price: { amount: number; priceId: number }) => {
    const priceInfo = priceData.find((p) => p.id === price.priceId);
    return {
      amount: Number(price.amount),
      multiple: priceInfo?.price,
      priceId: price.priceId,
      totalPrice: Number(price.amount) * Number(priceInfo?.price),
      folderPriceLog: {
        create: {
          action: ActionType.CREATE,
          changedBy,
          newpriceId: price.priceId,
          newAmount: Number(price.amount),
        },
      },
    };
  };
  return {
    name: folder.name,
    code: code,
    officeId: officeId,
    status: processStatus.DEFAULT,
    billNumber: folder.billNumber,
    folderPrice: {
      create: folder.folderPrice?.map(createFolderPrice),
    },
    folderLog: {
      create: {
        action: ActionType.CREATE,
        changedBy,
        newName: folder.name,
        newCode: code,
        newStatus: processStatus.DEFAULT,
      },
    },
  };
};
export const calculatePrices = (
  price: number,
  totalApplications: number,
  approvedApplications: number,
) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const safeNumber = (value: number) => (isNaN(value) ? 0 : value);
  const total = safeNumber(price) * safeNumber(totalApplications);
  const approved = safeNumber(price) * safeNumber(approvedApplications);

  return {
    totalPrice: formatCurrency(total),
    approvedPrice: formatCurrency(approved),
  };
};

export const generateNumbers = async ({
  folderId,
  total,
  initialNumber,
  officeId,
}: {
  folderId: number;
  total: number;
  initialNumber: string;
  officeId: number;
}): Promise<{ number: string; folderId: number }[]> => {
  const numbers = [];
  let currentNumber = initialNumber;
  for (let i = 0; i < total; i++) {
    numbers.push({
      number: currentNumber,
      folderId,
      officeId,
    });
    currentNumber = String(Number(currentNumber) + 1).padStart(6, "0");
  }
  return numbers;
};

export const getLatestNumber = async (tx: Prisma.TransactionClient, officeId: number): Promise<string> => {
  const currentYear = new Date().getFullYear();
  try {
    const latestNumber = await tx.finance.findFirst({
      where: {
        officeId,
        createdAt: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      },
      orderBy: { id: "desc" },
    });
    if (!latestNumber?.receiptNumber || isNaN(Number(latestNumber.receiptNumber))) {
      return "000001";
    }
    return String(Number(latestNumber.receiptNumber) + 1).padStart(6, "0");
  } catch {
    return "000001";
  }
};
export const getNumber = async (tx: Prisma.TransactionClient, officeId: number): Promise<string> => {
  const currentYear = new Date().getFullYear();
  try {
    const latestNumber = await tx.number.findFirst({
      where: {
        officeId,
        createdAt: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      },
      orderBy: { id: "desc" },
    });
    if (!latestNumber?.number || isNaN(Number(latestNumber.number))) {
      return "0001";
    }
    return String(Number(latestNumber.number) + 1).padStart(4, "0");
  } catch {
    return "0001";
  }
};

export const classifyError = (error: Error): string => {
  const errorMessage = error.message.toLowerCase();

  if (
    errorMessage.includes("cannot move backwards") ||
    errorMessage.includes("backwards or stay at the same step")
  ) {
    return "BACKWARDS_STEP";
  }

  if (
    errorMessage.includes("only progress to the next immediate step") ||
    errorMessage.includes("can only progress to the next immediate step")
  ) {
    return "INVALID_PROGRESSION";
  }

  if (errorMessage.includes("folder not found")) {
    return "NOT_FOUND";
  }
  return "UNKNOWN";
};

export const getErrorResponse = (errorType: string) => {
  switch (errorType) {
    case "BACKWARDS_STEP":
      return {
        status: StatusCodes.BAD_REQUEST,
        body: {
          status: "error",
          message: "Cannot move backwards in process steps",
        },
      };
    case "INVALID_PROGRESSION":
      return {
        status: StatusCodes.BAD_REQUEST,
        body: {
          status: "error",
          message: "Can only progress to the next immediate step",
        },
      };
    case "NOT_FOUND":
      return {
        status: StatusCodes.NOT_FOUND,
        body: {
          status: "error",
          message: "Folder not found",
        },
      };
    default:
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        body: {
          status: "error",
          message: "An unexpected error occurred",
        },
      };
  }
};

export const STEP_PROGRESSION: processStatus[] = [
  processStatus.DEFAULT,
  processStatus.FINANCE_UNDER_REVIEW,
  processStatus.PENDING,
  processStatus.APPROVED_BY_POLICE,
  processStatus.POLICE_UNDER_REVIEW,
  processStatus.IN_PRODUCTION,
  processStatus.FINISHED,
];

export const getNextStatus = (
  currentStatus: processStatus,
): processStatus | null => {
  const currentStepIndex = STEP_PROGRESSION.indexOf(currentStatus);
  if (
    currentStepIndex === -1 ||
    currentStepIndex === STEP_PROGRESSION.length - 1
  ) {
    return null;
  }
  return STEP_PROGRESSION[currentStepIndex + 1];
};

interface IncludeQuery {
  price?: boolean;
  number?: boolean;
}
export const buildIncludeFolderQuery = (req: Request): IncludeQuery => {
  const { expandNumber, expandPrice } = req.query;
  const include: IncludeQuery = {};
  if (expandPrice === "true") {
    include.price = true;
  }
  if (expandNumber === "true") {
    include.number = true;
  }
  return include;
};

export const buildFolderLogData = (
  currentFolder: {
    name: string;
    code: string | null;
    status: processStatus;
    totalApplications: number;
  },
  updatedFolder: { name: string; totalApplications: number },
  folderId: number,
  changedBy: number,
) => {
  return {
    folderId,
    action: ActionType.UPDATE,
    changedBy,
    changeDate: new Date(),
    oldName: currentFolder?.name,
    newName: updatedFolder?.name,
    oldCode: currentFolder?.code,
    newCode: currentFolder?.code,
    oldStatus: currentFolder?.status,
    newStatus: currentFolder?.status,
  };
};
