import {type Request, type Response} from 'express';
import { AuthService } from '../services/AuthService.js';
import { LoginSchema, SignUpSchema } from '../models/auth.js';
import { getParsedData } from '../utils/utils.js';
import logger from '../utils/logger.js';
import { prisma } from '../utils/prisma.js';

const authService = new AuthService(prisma);

export async function loginController(req: Request, res: Response) {
    const result = LoginSchema.safeParse(req.body);
    const data = getParsedData(result);

    const { accessToken, refreshToken } = await authService.login(data);

    return res
        .cookie("access_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000 // 15 minutes
        })
        .json({ accessToken });
}

export async function registerController(req: Request, res: Response) {
    logger.info(req.body);
    const result = SignUpSchema.safeParse(req.body);
    const data = getParsedData(result);

    const { accessToken, refreshToken } = await authService.signUp(data);

    return res
        .cookie("access_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000 // 15 minutes
        })
        .json({ accessToken });
}