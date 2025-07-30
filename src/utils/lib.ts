import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TokenPayload } from "src/api/user/types";

declare global {
  namespace Express {
    interface Request {
      tokenPayload?: TokenPayload;
    }
  }
}

export const dataTokenPayload = (req: Request, res: Response): TokenPayload | any => {
  const payload = req.tokenPayload as TokenPayload;
  if (!payload) {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: "error",
      message: "User not authorized",
    });
  }
  return payload;
};