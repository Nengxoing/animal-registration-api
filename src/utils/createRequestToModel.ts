
import { PrismaClient } from "@prisma/client";

interface BaseModel {
  createdAt: Date;
  updatedAt: Date;
}

type PrismaModels = keyof Omit<
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

interface ModelFieldsInput {
  body: Record<string, any>;
  model: PrismaModels;
}

const prisma = new PrismaClient();

export function generateModelFields<T>({
  body,
  model,
}: ModelFieldsInput): Omit<T, "id"> & BaseModel {
  const _modelName = prisma[model] as any;
  const filteredData = filterBodyFields<T>(body, _modelName.fields);
  const withTimestamps = addTimestamps<T>(filteredData);
  return withTimestamps;
}

function filterBodyFields<T>(
  body: Record<string, any>,
  fields: Record<string, any>,
): Partial<T> {
  return Object.keys(fields).reduce<Partial<T>>((acc, key) => {
    if (key in body) {
      acc[key as keyof T] = body[key];
    }
    return acc;
  }, {});
}

function addTimestamps<T>(data: Partial<T>): Omit<T, "id"> & BaseModel {
  const currentDate = new Date();
  return {
    ...data,
    createdAt: currentDate,
    updatedAt: currentDate,
  } as Omit<T, "id"> & BaseModel;
}
