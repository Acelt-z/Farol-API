import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/interfaces/errorCodes.js";
import { getTokenSecrets } from "../utils/utils.js";

interface JwtPayload {
  sub: string;
}

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
){
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError({
      message: "Unauthorized",
      errorCode: ErrorCodes.UNAUTHORIZED,
      statusCode: 401
    });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    throw new AppError({
      message: "Unauthorized",
      errorCode: ErrorCodes.UNAUTHORIZED,
      statusCode: 401
    });
  }

  try {
    const {accessSecret} = getTokenSecrets();
    const payload = jwt.verify(
      token,
      accessSecret
    ) as JwtPayload;

    req.userId = payload.sub;

    next();
  } catch {
    throw new AppError({
      message: "Invalid or expired token",
      errorCode: ErrorCodes.UNAUTHORIZED,
      statusCode: 401
    });
  }
}