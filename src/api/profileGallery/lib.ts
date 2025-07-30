import { Prisma } from "@prisma/client";
import { Request } from "express";

export const buildProfileGalleryWhereClause = (req: Request) => {
  const { search } = req.query;
  const where: Prisma.profileGalleryWhereInput = {
    deletedAt: null,
  };
  const searchTerm = typeof search === "string" ? search : "";
  if (searchTerm) {
    where.OR = [
      { profile: { firstName: { contains: searchTerm, mode: "insensitive" } } },
      { profile: { lastName: { contains: searchTerm, mode: "insensitive" } } },
      { profile: { applicationNumber: { contains: searchTerm, mode: "insensitive" } } },
      { gallery: { name: { contains: searchTerm, mode: "insensitive" } } },
    ];
    if (/^\d+$/.test(searchTerm)) {
      where.OR.push(
        { profile: { barcode: { equals: BigInt(searchTerm) } } },
      );
    }
  }
  return where;
};