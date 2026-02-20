export type CustomError = {
    errorLabel: string, 
    errorSlug: string, 
    statusCode: number
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorSlug: string;

  constructor({ errorLabel, errorSlug, statusCode }: CustomError) {
    super(errorLabel);

    this.statusCode = statusCode;
    this.errorSlug = errorSlug;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}