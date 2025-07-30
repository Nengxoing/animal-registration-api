/* eslint-disable max-params */
import cls from "cls-hooked";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import logger from "./config";

export const logNamespace = cls.createNamespace("logger");

export function logRequestResponse(
  req: Request,
  res: Response,
  next: NextFunction,
  ignorePaths: string[] = [],
) {
  // Skip some apis
  if (
    ignorePaths &&
    [...ignorePaths].some((path) => req.originalUrl.includes(path))
  ) {
    return next();
  }

  // Extract the user's IP address from the X-Real-IP header or the connection's remote address
  const ip = req.headers["x-real-ip"] || req.socket.remoteAddress;

  // Generate a unique request ID
  const requestId = uuidv4();

  // Add tracing data if necessary
  const tracingData: any = req.body.tracingData;

  // Attempt to parse the request body as JSON; if it fails, use the original data
  let requestBody;
  try {
    requestBody = JSON.parse(req.body);
  } catch {
    requestBody = req.body;
  }

  // Log the request metadata, ID, tracing data, and body using Winston
  logger.info("Request", {
    method: req.method,
    url: req.originalUrl,
    requestId,
    ip,
    requestBody,
    tracingData,
  });

  // Capture the original 'send' function and the start time
  const originalSend = res.send;
  const startTime = Date.now();

  // Replace 'send' with a custom function
  // @ts-ignore
  res.send = function (data) {
    // Calculate the response time
    const responseTime = Date.now() - startTime;

    // Attempt to parse the response body as JSON; if it fails, use the original data
    let responseBody;
    try {
      responseBody = JSON.parse(data);
    } catch {
      responseBody = data;
    }

    // Log the response metadata, ID, tracing data, and body using Winston
    logger.info("Response", {
      timestamp: new Date().toISOString(),
      requestId,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      responseTime,
      responseBody,
      tracingData,
    });

    // Call the original 'send' function with the provided data
    originalSend.apply(res, [arguments[0]]);
  };

  // Register cls
  logNamespace.run(() => {
    logNamespace.set("requestId", requestId);
    logNamespace.set("tracingData", tracingData);
    logNamespace.set("ip", ip);

    // Call the next middleware or route handler
    return next();
  });
}
