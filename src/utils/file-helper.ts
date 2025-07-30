/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-magic-numbers */

import dayjs from "dayjs";
import multer, { diskStorage } from "multer";
import { resolve } from "path";
import env from "./env";
export function setFileName(length: number = 25): string {
  let text = "";
  const possible = "abcdefghijklmnopqrstuvwxyz012345678ASDFGHJKLZXCVBNMQWERTYUIOP";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const dateDir = dayjs().format("YYYYMMDD");

export const upload = (directory: string = "", separateByDate = false) =>
  multer({
    storage: diskStorage({
      destination: resolve(`${env.PWD}/uploads/${directory}`),
      filename: (_, file, cb) => {
        const ext = file.originalname.split(".").pop();
        const fileName = dateDir + file.fieldname + setFileName() + `.${ext}`;
        cb(null, `${fileName}`);
      },
    }),
  });

export const uploadFiles = (
  directory: string = "",
  separateByDate = false,
  fields: string[] = ["image"],
) =>
  multer({
    storage: diskStorage({
      destination: resolve(`${env.PWD}/uploads/${directory}`),
      filename: (_, file, cb) => {
        const ext = file.originalname.split(".").pop();
        const fileName = dateDir + file.fieldname + setFileName() + `.${ext}`;
        cb(null, `${fileName}`);
      },
    }),
  }).fields(
    fields.map((name) => ({
      name,
      maxCount: 1,
    })),
  );