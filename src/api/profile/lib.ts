/* eslint-disable no-magic-numbers */
import { Prisma } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { dateTimeFormat } from "../../utils/dateFormat";

export function buildProfileRecord({
  profile,
  officeId,
  barcode,
  oldImage,
  imagePath,
}: {
  profile: any;
  imagePath: any;
  officeId: any;
  barcode: string;
  oldImage?: any;
}) {
  const result = {
    image: imagePath,
    oldImage: oldImage || null,
    applicationNumber: profile.applicationNumber || null,
    firstName: profile.firstName,
    lastName: profile.lastName,
    age: parseInt(profile.age, 10),
    weight: parseInt(profile.weight, 10),
    height: parseInt(profile.height, 10),
    breed: profile.breed,
    barcode: parseInt(barcode!, 10),
    gender: profile.gender,
    officeId: officeId ? Number(officeId) : null,
    updatedAt: new Date(),
  };
  return result;
}

export function generateBarcode(): string {
  const randomSixDigits = Math.floor(1000000 + Math.random() * 900000).toString();
  return `${randomSixDigits}`;
}

export function buildUpdateProfileRecord({
  // profile,
  imagePath,
}: {
  profile: Record<string, any>;
  imagePath: string | null;
}) {
  const result: Record<string, any> = {
    updatedAt: new Date(),
  };
  if (imagePath) {
    result.image = imagePath;
  }
  return result;
}

export function buildEditProfileRecord({
  imagePath,
  profile,
  oldImage,
}: {
  profile: Record<string, any>;
  imagePath: string | null;
  oldImage: any;
}) {
  const newRecord = {
    image: imagePath,
    oldImage: oldImage || null,
    applicationNumber: profile.applicationNumber,
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    age: parseInt(profile.age, 10),
    weight: parseInt(profile.weight, 10),
    height: parseInt(profile.height, 10),
    breed: profile.breed,
    gender: profile.gender,
    updatedAt: new Date(),
    deletedAt: null,
  };
  return newRecord;
}

export const gender: { [key: string]: string } = {
  MALE: "ຊາຍ",
  FEMALE: "ຍິງ",
};

export function formatDate(dataWithIndex: any[]) {
  return dataWithIndex.map((profile) => ({
    ...profile,
    createdAt: dateTimeFormat(profile.createdAt, "DD/MM/YYYY"),
    updatedAt: dateTimeFormat(profile.updatedAt, "DD/MM/YYYY"),
    deletedAt: dateTimeFormat(profile.deletedAt, "DD/MM/YYYY"),
    dateOfBirth: dateTimeFormat(profile.dateOfBirth, "DD/MM/YYYY"),
    gender: profile.gender ?? "",
  }));
}

export const excludeBlacklistedProfiles = {
  NOT: {
    blacklist: {
      some: {},
    },
  },
};

export const generateLastSixMonths = (): string[] => {
  const months: string[] = [];
  const currentDate = new Date();
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date();
    monthDate.setMonth(currentDate.getMonth() - i);
    months.push(monthDate.toLocaleString("default", { month: "long" }));
  }
  return months;
};

export const aggregateProfilesByGender = (
  profiles: { createdAt: Date; gender: string }[],
  months: string[],
): { month: string; male: number; female: number }[] => {
  const result = months.map((month) => ({ month, male: 0, female: 0 }));
  profiles.forEach((profile) => {
    const month = profile.createdAt.toLocaleString("default", { month: "long" });
    const gender = profile.gender.toLowerCase();
    const monthIndex = months.indexOf(month);
    if (monthIndex !== -1) {
      if (gender === "male") {
        result[monthIndex].male += 1;
      } else if (gender === "female") {
        result[monthIndex].female += 1;
      }
    }
  });
  return result;
};

export const buildWhereClause = ({
  search,
  gender,
  year,
  date,
  officeId,
  excludeApplications = undefined,
  barcode,
  officeIds,
}: {
  search?: string;
  gender?: string;
  year?: string;
  date?: Date;
  deletedAt?: string;
  excludeApplications?: boolean;
  officeId?: number;
  officeIds?: string;
  barcode?: number;
}): Prisma.profileWhereInput => {
  const whereClause: Prisma.profileWhereInput = {
    
  };

  if (search) {
    whereClause.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { applicationNumber: { contains: search, mode: "insensitive" } },
      { barcode: { equals: Number(search) || undefined } },
    ];
  }

  const officeIdsList = officeIds ? String(officeIds).split(",").map(Number) : [];
  if (officeIdsList.length > 0) {
    whereClause.officeId = { in: officeIdsList };
  } else if (officeId) {
    whereClause.officeId = Number(officeId);
  }

  if (gender) {
    whereClause.gender = { equals: gender, mode: "insensitive" };
  }

  if (date) {
    whereClause.createdAt = {
      gte: startOfDay(date),
      lt: endOfDay(date),
    };
  } else if (year) {
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const startOfNextYear = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);
    whereClause.createdAt = {
      gte: startOfYear,
      lt: startOfNextYear,
    };
  }

  if (barcode) {
    whereClause.barcode = barcode;
  }

  if (excludeApplications) {
    whereClause.application = {
      none: {},
    };
  }

  return whereClause;
};
