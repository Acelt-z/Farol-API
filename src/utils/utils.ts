import type { ZodSafeParseResult } from "zod";
import { ValidationError } from "../errors/ValidationError.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/interfaces/errorCodes.js";

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