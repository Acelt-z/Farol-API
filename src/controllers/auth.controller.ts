import {type Request, type Response} from 'express';
import { login, signUp } from '../services/auth.service.js';
import { LoginSchema, SignUpSchema } from '../models/auth.js';
import { getParsedData } from '../utils/utils.js';

export async function loginController(req: Request, res: Response) {
    const result = LoginSchema.safeParse(req.body);
    const data = getParsedData(result);

    await login(data);

    return res.status(200).json({ message: "Login successful" });
}

export async function registerController(req: Request, res: Response) {
    const result = SignUpSchema.safeParse(req.body);
    const data = getParsedData(result);

    await signUp(data);

    return res.status(200).json({ message: "Register successful" });
}