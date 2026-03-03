export const ErrorCodesHttpStatus = {
  INTERNAL_SERVER_ERROR: { httpStatus: 500 },
  VALIDATION_ERROR: { httpStatus: 400 },
  LABEL_REQUIRED: { httpStatus: 400 },
  INVALID_CREDENTIALS: { httpStatus: 401 },
  NOT_FOUND: { httpStatus: 404 },
  UNAUTHORIZED: { httpStatus: 401 },
  INVALID_INPUT: { httpStatus: 400 },
  MISSING_PARAMETERS: {httpStatus: 400},
  INVALID_IDENTIFIER: {httpStatus: 400}
} as const;

export const ErrorCode = {
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  LABEL_REQUIRED: "LABEL_REQUIRED",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  INVALID_INPUT: "INVALID_INPUT",
  INVALID_IDENTIFIER: "INVALID_IDENTIFIER",
  MISSING_PARAMETERS: "MISSING_PARAMETERS",
} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

export function getErrorCategory({status, errorType}: {status: number, errorType?: ErrorCode}): string {
  if (errorType) return errorType;
  if (status >= 400 && status < 500) return "CLIENT_ERROR";
  if (status >= 500) return "SERVER_ERROR";
  return "UNKNOWN_ERROR";
}

