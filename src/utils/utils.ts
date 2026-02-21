import type { ZodSafeParseResult } from "zod";
import { ValidationError } from "../errors/ValidationError.js";

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