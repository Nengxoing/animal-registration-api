
import * as dotenv from "dotenv";

dotenv.config();

export default {
  PWD: process.env.PWD || process.cwd(),
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "0.0.0.0",
  NODE_PORT: parseInt(process.env.NODE_PORT || "8000"),
  SERVICE_NAME: process.env.SERVICE_NAME,
  JWT_PRIVATE_KEY: `${process.env.JWT_PRIVATE_KEY}`,
  JWT_PUBLIC_KEY: `${process.env.JWT_PUBLIC_KEY}`,
  JWT_REFRESH_PRIVATE_KEY: `${process.env.JWT_REFRESH_PRIVATE_KEY}`,
  JWT_REFRESH_PUBLIC_KEY: `${process.env.JWT_REFRESH_PUBLIC_KEY}`,
  BARCODE_SALT: process.env.BARCODE_SALT || "nHO9NhrwoL4dmvWasGVHF6487O6HYAjmtvfLGpEUcTVPaQWg9SMiQnNmz27uxFuvW3rNSnx2lSiJHqYtKeQ",
  ALPHABET: process.env.ALPHABET || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
};