import { PrismaClient } from "@prisma/client";
import extension from "../utils/extension";

export const prisma = new PrismaClient({
  // log: ["query", "info", "warn", "error"],
});

extension;
