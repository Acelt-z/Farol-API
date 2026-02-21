import type { ErrorCode } from "./errorCodes.js";

export type CustomError = {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  fields?: ValidationItem[];
};

export type ApiErrorResponse = {
  status: number;
  error: string; // category (VALIDATION_ERROR, INTERNAL_ERROR, etc.)
  code: ErrorCode;
  message: string;
  fields?: ValidationItem[];
  timestamp: string;
  path: string;
};

export type ValidationItem = {
    field: string,
    errorLabel: string
}