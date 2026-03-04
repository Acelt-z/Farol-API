import { AppError } from "./AppError.js";
import { ErrorCode } from "./interfaces/errorCodes.js";

export class ForbiddenError extends AppError {

  constructor(message?: string | undefined) {
    super({
      message: message ?? `Forbidden`,
      errorCode: ErrorCode.FORBIDDEN
    });

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}