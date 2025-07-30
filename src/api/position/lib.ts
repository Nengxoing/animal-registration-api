
/* eslint-disable no-magic-numbers */
import { folder } from "@prisma/client";
import { prisma } from "../../prisma/index";

export function builderFolderRecord({
  folder,
  code,
}: {
  folder: folder;
  code: string;
}) {
  const result = {
    name: folder.name,
    code,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
  return result;
}

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
}: {
  folderId: number;
  total: number;
  initialNumber: string;
}): Promise<{ number: string; folderId: number }[]> => {
  const numbers = [];
  let currentNumber = initialNumber;
  for (let i = 0; i < total; i++) {
    numbers.push({
      number: currentNumber,
      folderId,
    });
    currentNumber = String(Number(currentNumber) + 1).padStart(6, "0");
  }
  return numbers;
};

export const getLatestNumber = async (): Promise<string> => {
  const currentYear = new Date().getFullYear();
  try {
    const latestNumber = await prisma.number.findFirst({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    const nextCode = latestNumber
      ? String(Number(latestNumber.number) + 1).padStart(6, "0")
      : "000001";
    return nextCode;
  } catch {
    return "000001";
  }
};
