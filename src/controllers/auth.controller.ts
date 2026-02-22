import {type Request, type Response} from 'express';
import { AuthService, login } from '../services/AuthService.js';
import { LoginSchema, SignUpSchema } from '../models/auth.js';
import { getParsedData } from '../utils/utils.js';
import logger from '../utils/logger.js';
import { prisma } from '../utils/prisma.js';

const authService = new AuthService(prisma);

export async function loginController(req: Request, res: Response) {
    const result = LoginSchema.safeParse(req.body);
    const data = getParsedData(result);

    await login(data);

    return res.status(200).json({ message: "Login successful" });
}

export async function registerController(req: Request, res: Response) {
    logger.info(req.body);
    const result = SignUpSchema.safeParse(req.body);
    const data = getParsedData(result);

    await authService.signUp(data);

    return res.status(200).json({ message: "Register successful" });
}