/* eslint-disable complexity */
import { application } from "@prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { Request } from "express";

type FileInfo = {
  name: string;
  file: string;
}[];

export function buildApplicationRecord(data: application, officeId: any, applicationFile: FileInfo) {
  return {
    numberId: Number(data.numberId),
    profileId: Number(data.profileId),
    folderId: Number(data.folderId),
    positionId: Number(data.positionId),
    officeId: Number(officeId) || 1,
    type: data.type,
    // expirationTerm: data.expirationTerm,
    // issueDate: data.issueDate,
    // expirationDate: data.expirationDate,
    applicationNumber: data.applicationNumber,
    status: data.status,
    createdAt: new Date(),
    updatedAt: new Date(),
    villageId: Number(data.villageId) || null,
    companyId: Number(data.companyId) || null,
    dependBy: data.dependBy,
    deletedAt: null,
    printCount: 0,
    applicationFile: {
      create: applicationFile.map((file) => ({
        name: file.name,
        filePath: file.file,
      })),
    },
  };
}
export function buildApplicationFileRecord(applicationFile: FileInfo, applicationId: number) {
  return applicationFile.map((file) => ({
    name: file.name,
    filePath: file.file,
    applicationId: applicationId,
    createdAt: new Date(),
  }));
}
export function buildApplicationRecordEdit({
  data,
  applicationFile,
  companyId,
  villageId,
}: {
  data: application,
  applicationFile: FileInfo,
  companyId: string,
  villageId: string,
}) {
  return {
    positionId: Number(data.positionId),
    updatedAt: new Date(),
    villageId: villageId ? Number(villageId) : null,
    companyId: companyId ? Number(companyId) : null,
    applicationNumber: data.applicationNumber,
    dependBy: data.dependBy,
    applicationFile: {
      deleteMany: {},
      create: applicationFile.map((file) => ({
        name: file.name,
        filePath: file.file,
      })),
    },
  };
}

export const buildWhereClause = ({ req }: { req: Request }) => {
  const {
    search,
    folderStatus,
    status,
    includeFinished,
    folderId,
    printCount,
    printCountMin,
    printCountMax,
    officeId,
    profileId,
    officeIds,
    dependBy,
    barcode,
    date,
    year,
  } = req.query;
  const { dateTime } = req.body;
  const whereClause: any = {};
  if (search) {
    whereClause.profile = {
      OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { identityNumber: { contains: search, mode: "insensitive" } },
        { applicationNumber: { contains: search, mode: "insensitive" } },
        { phoneNumber: { contains: search, mode: "insensitive" } },
      ],
    };
  }
  if (dependBy) {
    whereClause.dependBy = String(dependBy);
  }
  if (profileId) {
    whereClause.profileId = Number(profileId);
  }
  if (dateTime) {
    whereClause.createdAt = dateTime;
  }
  const newBarcode = typeof barcode === "string" ? parseInt(barcode, 10) : undefined;
  if (newBarcode !== undefined && !isNaN(newBarcode)) {
    whereClause.profile = { barcode: newBarcode };
  }
  if (status) {
    whereClause.status = status;
  }
  if (folderStatus) {
    whereClause.folder = { status: folderStatus };
  }
  if (folderId) {
    whereClause.folderId = Number(folderId);
  }
  const officeIdsList = officeIds ? String(officeIds).split(",").map(Number) : [];
  if (officeIdsList.length > 0) {
    whereClause.officeId = { in: officeIdsList };
  } else if (officeId) {
    whereClause.officeId = Number(officeId);
  }
  if (includeFinished === "true") {
    whereClause.status = { in: ["FINISHED", "DEFAULT", "PROCESS"] };
  } else if (includeFinished === "false") {
    whereClause.status = { not: "FINISHED" };
  }
  if (printCount) {
    whereClause.printCount = Number(printCount);
  }
  if (printCountMin && printCountMax) {
    whereClause.printCount = {
      gte: Number(printCountMin),
      lte: Number(printCountMax),
    };
  } else if (printCountMin) {
    whereClause.printCount = {
      gte: Number(printCountMin),
    };
  } else if (printCountMax) {
    whereClause.printCount = {
      lte: Number(printCountMax),
    };
  }
  if (typeof date === "string") {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      whereClause.createdAt = {
        gte: startOfDay(parsedDate),
        lt: endOfDay(parsedDate),
      };
    }
  } else if (year) {
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const startOfNextYear = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);
    whereClause.createdAt = {
      gte: startOfYear,
      lt: startOfNextYear,
    };
  }
  return whereClause;
};
export const buildWhereClauseHistory = ({ req }: { req: Request }) => {
  const profileId = Number(req.params.id);
  const whereClause: any = {};
  if (profileId) {
    whereClause.profileId = Number(profileId);
  }
  return whereClause;
};

export function builderApplicationLogRecord({ application, userId }: { application: application, userId: number }) {
  const result = {
    applicationId: application.id,
    changedById: userId,
    actionTaken: "Created application request",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return result;
}
