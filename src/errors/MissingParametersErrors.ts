import { AppError } from "./AppError.js";
import { ErrorCode, getErrorCategory } from "./interfaces/errorCodes.js";
import type { ValidationItem } from "./interfaces/errorTypes.js";

export class MissingParametersError extends AppError {
  public readonly errors: ValidationItem[];

  constructor(errors: ValidationItem[]) {
    super({
      message: getErrorCategory({status: 400, errorType: ErrorCode.MISSING_PARAMETERS}),
      errorCode: ErrorCode.MISSING_PARAMETERS,
      fields: errors
    });

    this.errors = errors;

    Object.setPrototypeOf(this, MissingParametersError.prototype);
  }
}