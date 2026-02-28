import { AppError } from "./AppError.js";
import { ErrorCode, getErrorCategory } from "./interfaces/errorCodes.js";
import type { ValidationItem } from "./interfaces/errorTypes.js";

export class ValidationError extends AppError {
  public readonly errors: ValidationItem[];

  constructor(errors: ValidationItem[]) {
    super({
      message: getErrorCategory({status: 400, isValidationError: true}),
      errorCode: ErrorCode.VALIDATION_ERROR,
      fields: errors
    });

    this.errors = errors;

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}