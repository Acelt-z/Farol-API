import {type Request, type Response} from 'express';
import { login, signUp } from '../services/auth.service.js';
import { ValidationError } from '../errors/ValidationError.js';
import { LoginSchema } from '../models/auth.js';

export async function loginController(req: Request, res: Response) {

    const result = LoginSchema.safeParse(req.body);

    if (!result.success) {
        const validationErrors = result.error.issues.map(issue => ({
            field: issue.path.join('.'),
            errorLabel: issue.message
        }));

        throw new ValidationError(validationErrors);
    }

    const data = result.data;

    await login(data);

    return res.status(200).json({ message: "Login successful" });
}

export async function registerController(req: Request, res: Response) {

    const result = LoginSchema.safeParse(req.body);

    if (!result.success) {
        const validationErrors = result.error.issues.map(issue => ({
            field: issue.path.join('.'),
            errorLabel: issue.message
        }));

        throw new ValidationError(validationErrors);
    }

    const data = result.data;

    await signUp(data);

    return res.status(200).json({ message: "Register successful" });
}