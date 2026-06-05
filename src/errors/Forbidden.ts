import { AppError } from "./AppError.js";
import { ErrorCode } from "./interfaces/errorCodes.js";

export class ForbiddenError extends AppError {
  constructor(message?: string) {
    super({
      message: message ?? `Forbidden`,
      errorCode: ErrorCode.FORBIDDEN,
    });

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
