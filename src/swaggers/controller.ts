import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { join } from "path";
import env from "../utils/env";
import { swaggerSign } from "./jwt";

const users = [
  { username: "thavisouk", password: "Welcome@01" },
  { username: "lit", password: "Lit@2024" },
  { username: "koun", password: "Lit@2024" },
  { username: "meng", password: "Lit@2024" },
];

export const swaggerRedirectController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token =
    req.cookies?.swagger_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.redirect("/swagger-login");
  } else {
    try {
      jwt.verify(token, env.JWT_PUBLIC_KEY, { algorithms: ["HS256"] });
      return next();
    } catch {
      const errorPagePath = join(env.PWD, "src/swaggers/swagger-login.html");
      res.status(StatusCodes.UNAUTHORIZED).sendFile(errorPagePath);
      return;
    }
  }
};

export const swaggerLoginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (user && user.password === password) {
    const token = await swaggerSign({ username: user.username });
    res.cookie("swagger_token", token, { httpOnly: true });
    const url = "/swagger";
    res.redirect(url);
  } else {
    const filePath = join(env.PWD, "dist/swaggers/error-page.html");
    res.sendFile(filePath);
  }
};

export const createLoginSwaggerController = async (
  req: Request,
  res: Response,
) => {
  res.sendFile(join(env.PWD, "dist/swaggers/swagger-login.html"));
};
