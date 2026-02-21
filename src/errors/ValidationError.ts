import { AppError } from "./AppError.js";
import { ErrorCodes, getErrorCategory } from "./interfaces/errorCodes.js";
import type { ValidationItem } from "./interfaces/errorTypes.js";

export class ValidationError extends AppError {
  public readonly errors: ValidationItem[];

  constructor(errors: ValidationItem[]) {
    super({
      message: getErrorCategory({status: 400, isValidationError: true}),
      errorCode: ErrorCodes.VALIDATION_ERROR,
      statusCode: 400,
      fields: errors
    });

    this.errors = errors;

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}