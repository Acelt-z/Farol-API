import type { NextFunction, Request, Response } from "express";
import { AppError, type CustomError } from "../errors/AppError.js";
import logger from "../utils/logger.js";


export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errorLabel: err.message,
      errorSlug: err.errorSlug,
      statusCode: err.statusCode
    } as CustomError);
  }

  logger.error(err);
  return res.status(500).json({
    errorLabel: 'An unexpected error ocurred',
    errorSlug: 'InternalServerError',
    statusCode: 500
  } as CustomError);
}