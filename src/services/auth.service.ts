// import { AppError } from "../errors/AppError.js"
// import { ErrorCodes } from "../errors/interfaces/errorCodes.js";
import type { ValidationItem } from "../errors/interfaces/errorTypes.js";
import { ValidationError } from "../errors/ValidationError.js";

export async function registerUser() {


    const errorFields: ValidationItem[] = [
        {
            field: 'C1',
            errorLabel: 'Erro no C1'
        }, 
        {
            field: 'C2',
            errorLabel: 'Erro no C2'
        }
    ];

    // throw new AppError({message: 'Mensagem', errorCode: ErrorCodes.INTERNAL_SERVER_ERROR, statusCode: 500});
    throw new ValidationError(errorFields);
}