import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/interfaces/errorCodes.js";
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
      errorCode: ErrorCode.UNAUTHORIZED,
    });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    throw new AppError({
      message: "Unauthorized",
      errorCode: ErrorCode.UNAUTHORIZED
    });
  }

  try {
    const {accessSecret, issuerSecret} = getTokenSecrets();
    const payload = jwt.verify(
      token,
      accessSecret,
      {
        issuer: issuerSecret,
      }
    ) as JwtPayload;

    req.userId = payload.sub;
    
    next();
  } catch {
    next(new AppError({
      message: 'Invalid or expired token',
      errorCode: ErrorCode.UNAUTHORIZED
    }))
  }
}