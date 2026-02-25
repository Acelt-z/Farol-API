export const ErrorCodes = {
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  LABEL_REQUIRED: "LABEL_REQUIRED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_INPUT: "INVALID_INPUT",
} as const;

export type ErrorCode = keyof typeof ErrorCodes;

export function getErrorCategory({status, isValidationError}: {status: number, isValidationError?: boolean}): string {
  if (isValidationError) return 'VALIDATION_ERROR';
  if (status >= 400 && status < 500) return "CLIENT_ERROR";
  if (status >= 500) return "SERVER_ERROR";
  return "UNKNOWN_ERROR";
}

