import type { ErrorCode } from "./interfaces/errorCodes.js";
import type { CustomError, ValidationItem } from "./interfaces/errorTypes.js";



export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly fields?: ValidationItem[] | undefined;

  constructor({ message, errorCode, statusCode, fields }: CustomError) {
    super(message);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.fields = fields ?? [];

    Object.setPrototypeOf(this, AppError.prototype);
  }
}