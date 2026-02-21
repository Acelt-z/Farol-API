import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import logger from "../utils/logger.js";
import { ErrorCodes, getErrorCategory } from "../errors/interfaces/errorCodes.js";
import type { ApiErrorResponse } from "../errors/interfaces/errorTypes.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      error: getErrorCategory({status: err.statusCode}),
      code: err.errorCode,
      message: err.message,
      fields: err.fields,
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    } as ApiErrorResponse);
  }

  logger.error(err);

  return res.status(500).json({
    status: 500,
    error: getErrorCategory({status: 500}),
    code: ErrorCodes.INTERNAL_SERVER_ERROR,
    fields: [],
    message: "An unexpected error occurred",
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  } as ApiErrorResponse);
}