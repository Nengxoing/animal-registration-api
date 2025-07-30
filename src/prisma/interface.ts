import { PrismaClient } from "@prisma/client";

export type PrismaModels = keyof Omit<
  PrismaClient,
  | "$connect"
  | "$disconnect"
  | "$on"
  | "$transaction"
  | "$use"
  | "$extends"
  | "$executeRaw"
  | "$queryRaw"
  | "$runCommandRaw"
>;
