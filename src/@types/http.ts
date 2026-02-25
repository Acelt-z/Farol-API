import { type Request } from "express";
import type { ErrorCode } from "../errors/interfaces/errorCodes.js";
import type { ValidationItem } from "../errors/interfaces/errorTypes.js";

export interface AuthenticatedRequest extends Request {
    userId: string
}

export type AccessTokenResponseDTO = {
    accessToken: string;
}

export type ApiErrorResponse = {
  status: number;
  error: string; // category (VALIDATION_ERROR, INTERNAL_ERROR, etc.)
  code: ErrorCode;
  message: string;
  fields?: ValidationItem[];
  timestamp: string;
  path: string;
};

export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: ApiErrorResponse;
}