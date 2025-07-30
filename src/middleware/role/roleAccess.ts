import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Roles } from "../../api/user/types";

interface TokenPayload {
  role?: Roles | Roles[]; // Role can be string, array, or undefined
  [key: string]: any;
}

export function roleAccess(requiredRoles: Roles[]): RequestHandler {
  if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
    throw new Error("requiredRoles must be a non-empty array");
  }
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const unauthorizedResponse = {
      status: "error",
      message: "No authentication payload found",
    };
    const forbiddenResponse = {
      status: "error",
      message: "Access denied: Insufficient role permissions",
    };
    const errorResponse = {
      status: "error",
      message: "An error occurred while validating permissions",
    };

    try {
      const payload: TokenPayload = tokenPayloadService(req);

      // Check if payload or role is missing
      if (!payload || typeof payload.role === "undefined") {
        res.status(StatusCodes.UNAUTHORIZED).json(unauthorizedResponse);
        return;
      }

      // If requiredRoles is specified, payload.role MUST be an array
      if (!Array.isArray(payload.role)) {
        res.status(StatusCodes.FORBIDDEN).json(forbiddenResponse);
        return;
      }

      const userRoles: Roles[] = payload.role; // Already confirmed as array

      const isAuthorized = isRoleAuthorized(userRoles, requiredRoles);
      if (!isAuthorized) {
        res.status(StatusCodes.FORBIDDEN).json(forbiddenResponse);
        return;
      }

      next();
    } catch {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
  };
}

function isRoleAuthorized(userRoles: Roles[], requiredRoles: Roles[]): boolean {
  return userRoles.some((role) => requiredRoles.includes(role));
}

export function tokenPayloadService(req: Request): TokenPayload {
  const payload = (req as any).tokenPayload;
  if (!payload) {
    throw new Error("Token payload not found in request");
  }
  return payload;
}
