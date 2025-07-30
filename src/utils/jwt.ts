import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { SignOptions } from "jsonwebtoken";
import env from "./env";

const issuer = "Boilerplate";
const subject = "Thavisoukmnlv@gmail.com";
const audience = "https://thavisoukmnlv.com";

const accessTokenOptions: SignOptions = {
  issuer,
  subject,
  audience,
  expiresIn: "1day",
  algorithm: "PS512",
};

const refreshTokenOptions: SignOptions = {
  issuer,
  subject,
  audience,
  expiresIn: "7days",
  algorithm: "PS512",
};

export const signAccessToken = async (payload: object): Promise<string> => {
  try {
    const privateKEY = env.JWT_PRIVATE_KEY;
    return jwt.sign(payload, privateKEY, accessTokenOptions);
  } catch {
    throw new Error("Failed to sign access token");
  }
};

export const signRefreshToken = async (payload: object): Promise<string> => {
  try {
    const refreshPrivateKEY = env.JWT_REFRESH_PRIVATE_KEY;
    return jwt.sign(payload, refreshPrivateKEY, refreshTokenOptions);
  } catch {
    throw new Error("Failed to sign refresh token");
  }
};

export const verifyAccessToken = async (token: string): Promise<any> => {
  try {
    const publicKEY = env.JWT_PUBLIC_KEY ?? "";
    return jwt.verify(token, publicKEY, accessTokenOptions);
  } catch {
    throw new Error("Invalid access token");
  }
};

export const verifyRefreshToken = async (token: string): Promise<any> => {
  try {
    const refreshPublicKEY = env.JWT_REFRESH_PUBLIC_KEY ?? "";
    return jwt.verify(token, refreshPublicKEY, refreshTokenOptions);
  } catch {
    throw new Error("Invalid refresh token");
  }
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token = req.headers["x-access-token"] as string;
  if (req.headers.authorization) {
    token = `${req.headers.authorization}`.replace("Bearer ", "");
  }
  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({ status: "error", message: "No token provided." });
    return;
  }
  try {
    const decoded = await verifyAccessToken(token);
    req.tokenPayload = decoded;
    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({ status: "error", message: "Unauthorized: Invalid token." });
  }
};

export const refreshTokenRoute = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(StatusCodes.BAD_REQUEST).json({ status: "error", message: "Refresh token is required." });
  }
  try {
    const decoded = await verifyRefreshToken(refreshToken);
    const newAccessToken = await signAccessToken({ userId: decoded.userId, email: decoded.email });
    res.json({
      status: "success",
      accessToken: newAccessToken,
    });
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({ status: "error", message: "Invalid refresh token." });
  }
};