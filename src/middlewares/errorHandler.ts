import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import logger from "../utils/logger.js";
import { ErrorCodes, getErrorCategory } from "../errors/interfaces/errorCodes.js";
import type { ApiErrorResponse, ApiResponse } from "../@types/http.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const now = new Date().toISOString();
  if (err instanceof AppError) {
    const error = {
      status: err.statusCode,
      error: getErrorCategory({status: err.statusCode}),
      code: err.errorCode,
      message: err.message,
      fields: err.fields,
      timestamp: now,
      path: req.originalUrl
    } as ApiErrorResponse;

    const body = {
      success: false,
      error
    } as ApiResponse<void>;

    logger.error(body);

    return res.status(err.statusCode).json(body);
  }

  logger.error(err.message);

  const internalError = {
    status: 500,
    error: getErrorCategory({status: 500}),
    code: ErrorCodes.INTERNAL_SERVER_ERROR,
    fields: [],
    message: "An unexpected error occurred",
    timestamp: now,
    path: req.originalUrl
  } as ApiErrorResponse;


  return res.status(500).json({
    success: false,
    error: internalError
  } as ApiResponse<void>);
}