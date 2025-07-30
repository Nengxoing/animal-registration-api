/* eslint-disable no-magic-numbers */
import fs from "fs-extra";
import { join } from "path";
import winston from "winston";
import "winston-daily-rotate-file";
import env from "../../utils/env";
import { logNamespace } from "./logger-middleware";

const logDirectory = join(env.PWD, "logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const transport = new winston.transports.DailyRotateFile({
  filename: join(logDirectory, "%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  maxSize: "3m",
  maxFiles: "1h",
});

const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify(
      {
        timestamp,
        level: `${level}`.toUpperCase(),
        port: env.NODE_PORT,
        message,
        requestId: logNamespace?.get("requestId"),
        tracingData: logNamespace?.get("tracingData"),
        username: logNamespace?.get("username"),
        user_type_name: logNamespace?.get("user_type_name"),
        url: logNamespace?.get("url"),
        ...meta,
      },
      null,
      env.NODE_ENV === "production" ? 0 : 4,
    );
  }),
);

const logger = winston.createLogger({
  level: "verbose",
  format: customFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.colorize({ all: env.NODE_ENV === "development" }),
    }),
    transport,
  ],
  defaultMeta: {
    service: env.SERVICE_NAME,
    environment: env.NODE_ENV,
  },
});

export default logger;
