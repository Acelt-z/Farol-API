import type { ErrorCode } from "./errorCodes.js";

export type CustomError = {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  fields?: ValidationItem[];
};

export type ValidationItem = {
    field: string,
    errorLabel: string
}