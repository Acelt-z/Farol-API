import type { ZodSafeParseResult } from "zod";
import { ValidationError } from "../errors/ValidationError.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/interfaces/errorCodes.js";
import { MissingParametersError } from "../errors/MissingParametersErrors.js";

export const DEFAULT_TRIAL_DAYS = 7;

export function getParsedData<T>(result: ZodSafeParseResult<T>, errorType: ErrorCode = ErrorCode.VALIDATION_ERROR): T {
    if (!result.success) {
        const errors = result.error?.issues.map(issue => ({
            field: issue.path.join('.'),
            errorLabel: issue.message
        }));

        switch (errorType) {
            case ErrorCode.VALIDATION_ERROR:
                throw new ValidationError(errors);

            case ErrorCode.MISSING_PARAMETERS:
                throw new MissingParametersError(errors);
                
            default:
                throw new AppError({
                    message: "Unknown validation error",
                    errorCode: errorType
                });
        }
    }

    return result.data;
}

type Tokens = {
    accessSecret: string,
    refreshSecret: string,
    issuerSecret: string
}

export function getTokenSecrets(): Tokens{
    const access = process.env.JWT_ACCESS_SECRET;
    const refresh = process.env.JWT_REFRESH_SECRET;
    const issuer = process.env.JWT_ISSUER;

    if (!access || !refresh || !issuer) {
        throw new AppError({
            message: "Define JWT secrets in environment variables",
            errorCode: ErrorCode.INTERNAL_SERVER_ERROR
        });
    }

    return {accessSecret: access, refreshSecret: refresh, issuerSecret: issuer};
}

export const addDaysToNow = (days: number): Date => {
    if (!Number.isInteger(days) || days <= 0) {
        throw new AppError({
            message: 'Days must be a positive integer',
            errorCode: ErrorCode.INVALID_INPUT
        });
    }

    const now = new Date();
    const futureDate = new Date(now);
    futureDate.setDate(now.getDate() + days);

    return futureDate;
};


export function assertUserIdxists(userId: string | undefined): asserts userId is string {
    if (!userId) {
        throw new AppError({
            message: "Unauthorized",
            errorCode: ErrorCode.UNAUTHORIZED
        });
    }
}

export function extractDigits(input: string): string {
    return input.replace(/\D/g, '');
}

export function buildUpdateData<T extends object>(dto: T) {
  return Object.fromEntries(
    Object.entries(dto).filter(([_, value]) => value !== undefined)
  );
}