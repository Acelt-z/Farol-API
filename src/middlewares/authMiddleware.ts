import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/interfaces/errorCodes.js";
import { adminAuth } from "../config/firebase.js";

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(
      new AppError({
        message: "Unauthorized",
        errorCode: ErrorCode.UNAUTHORIZED,
      }),
    );
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return next(
      new AppError({
        message: "Unauthorized",
        errorCode: ErrorCode.UNAUTHORIZED,
      }),
    );
  }

  const token = parts[1];

  if (!token) {
    return next(
      new AppError({
        message: "Unauthorized",
        errorCode: ErrorCode.UNAUTHORIZED,
      }),
    );
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.userId = decodedToken.uid;

    next();
  } catch {
    next(
      new AppError({
        message: "Invalid or expired token",
        errorCode: ErrorCode.UNAUTHORIZED,
      }),
    );
  }
}
