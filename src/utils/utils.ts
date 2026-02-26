import type { ZodSafeParseResult } from "zod";
import { ValidationError } from "../errors/ValidationError.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/interfaces/errorCodes.js";

export const DEFAULT_TRIAL_DAYS = 7;

export function getParsedData<T>(result: ZodSafeParseResult<T>){
    if (!result.success) {
        const validationErrors = result.error?.issues.map(issue => ({
            field: issue.path.join('.'),
            errorLabel: issue.message
        }));

        throw new ValidationError(validationErrors);
    }

    return result.data;
}

type Tokens = {
    accessSecret: string,
    refreshSecret: string
}

export function getTokenSecrets(): Tokens{
    const access = process.env.JWT_ACCESS_SECRET;
    const refresh = process.env.JWT_REFRESH_SECRET;

    if (!access || !refresh) {
        throw new AppError({
        message: "Define JWT secrets in environment variables",
        errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
        statusCode: 500
        });
    }

    return {accessSecret: access, refreshSecret: refresh};
}

export const addDaysToNow = (days: number): Date => {
    if (!Number.isInteger(days) || days <= 0) {
        throw new AppError({
            message: 'Days must be a positive integer',
            errorCode: ErrorCodes.INVALID_INPUT,
            statusCode: 400
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
            errorCode: ErrorCodes.UNAUTHORIZED,
            statusCode: 401
        });
    }
}