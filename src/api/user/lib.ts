import { Prisma, Role } from "@prisma/client";
import bcrypt from "bcrypt";

import { findOneUserServicer } from "./service";
import { UserRecord } from "./types";

export const buildUserRecord = async(data: UserRecord) => {
  const { firstName, lastName, phone, email, password, role, isActive, officeId, username, userOffice } = data;
  const userRecord: UserRecord = { firstName, lastName, phone, email, role, isActive, username, userOffice,
    officeId: officeId === 0 ? null : officeId  };
  if (password && password.trim() !== "") {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    userRecord.password = hashedPassword;
  }
  return userRecord;
};

export const hashPassword = (password: string): string => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const buildNewUser = ({
  firstName,
  lastName,
  phone,
  email,
  hashedPassword,
  role,
  username,
  officeId,
  isActive,
  userOffice,
}: any) => ({
  firstName,
  lastName,
  phone,
  username,
  email,
  password: hashedPassword,
  role: role || Role.ADMIN,
  isActive: isActive ?? true,
  updatedAt: new Date(),
  createdAt: new Date(),
  deletedAt: null,
  officeId: officeId ? parseInt(officeId, 10) : null,
  userOffice: userOffice?.length > 0
    ? {
      create: userOffice.map((officeId: number) => ({
        office: { connect: { id: officeId } },
      })),
    }
    : undefined,
});

export const isPhoneNumberTaken = async(phone: string): Promise<boolean> => {
  const user = await findOneUserServicer(phone);
  return !!user;
};

export const validatePassword = (plainPassword: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

export const buildPayload = (user: any) => ({
  id: user.id,
  phone: user.phone,
  role: [user.role],
  firstName: user.firstName,
  email: user.email,
});

export const buildWhereClause = ({
  search,
}: {
  search?: any;
}): Prisma.userWhereInput => {
  const whereClause: Prisma.userWhereInput = {};
  if (search) {
    whereClause.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }
  return whereClause;
};
