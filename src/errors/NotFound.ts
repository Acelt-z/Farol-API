import { AppError } from "./AppError.js";
import { ErrorCode } from "./interfaces/errorCodes.js";

export class NotFoundError extends AppError {

  constructor(field: string) {
    super({
      message: `${field} not found`,
      errorCode: ErrorCode.NOT_FOUND
    });

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}