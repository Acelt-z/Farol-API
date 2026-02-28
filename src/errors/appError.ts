import { ErrorCodesHttpStatus, type ErrorCode } from "./interfaces/errorCodes.js";
import type { CustomError, ValidationItem } from "./interfaces/errorTypes.js";



export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly fields?: ValidationItem[] | undefined;

  constructor({ message, errorCode, fields }: CustomError) {
    super(message);

    this.errorCode = errorCode;
    this.statusCode = ErrorCodesHttpStatus[errorCode].httpStatus;
    this.fields = fields ?? [];

    Object.setPrototypeOf(this, AppError.prototype);
  }
}