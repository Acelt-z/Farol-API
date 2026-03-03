import { isCpf } from "validator-brazil";
import { extractDigits } from "../utils/utils.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/interfaces/errorCodes.js";

export type UserIdentifier =
  | { type: "cpf"; value: string }
  | { type: "email"; value: string };

export function isEmailValid(email:string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
export function parseIdentifier(identifier: string): UserIdentifier {
    const digits = extractDigits(identifier);

    if (isCpf(digits)) {
        return { type: "cpf", value: digits };
    }

    if (isEmailValid(identifier)) {
        return { type: "email", value: identifier.toLowerCase() };
    }

    throw new AppError({
        message: "Invalid identifier",
        errorCode: ErrorCode.INVALID_IDENTIFIER
    });
}

