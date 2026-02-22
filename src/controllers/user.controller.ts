import {type Request, type Response} from 'express';
import { UserService } from '../services/UserService.js';
import { prisma } from '../utils/prisma.js';
import { AppError } from '../errors/AppError.js';
import { ErrorCodes } from '../errors/interfaces/errorCodes.js';

const userService = new UserService(prisma);


export async function getCurrentUserController(req: Request, res: Response) {
    if (!req.userId) {
        throw new AppError({
            message: "Unauthorized",
            errorCode: ErrorCodes.UNAUTHORIZED,
            statusCode: 401
        });
    }
    return res.json(await userService.getCurrentUser(req.userId));
}