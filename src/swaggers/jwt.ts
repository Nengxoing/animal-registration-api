import { NextFunction, Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import env from "../utils/env";

const i = "Boilerplate";
const s = "Thavisoukmnlv@gmail.com";
const a = "https://thavisoukmnlv.com";

const accessTokenOptions: SignOptions = {
  issuer: i,
  subject: s,
  audience: a,
  expiresIn: "1day",
  algorithm: "PS512",
};

export const swaggerSign = async (payload: object) => {
  try {
    const privateKEY = env.JWT_PRIVATE_KEY;
    return jwt.sign(payload, privateKEY, accessTokenOptions);
  } catch (error) {
    throw error;
  }
};

export const swaggerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.swagger_token;
  const url = "/swagger-login";
  if (!token) {
    res.redirect(url);
  } else {
    const publicKEY = env.JWT_PUBLIC_KEY ?? "";
    jwt.verify(token, publicKEY, accessTokenOptions, (err) => {
      if (err) {
        res.redirect(url);
      } else {
        next();
      }
    });
  }
};
