import {type Request, type Response} from 'express';
import { UserService } from '../services/UserService.js';
import { prisma } from '../utils/prisma.js';
import { AppError } from '../errors/AppError.js';
import { ErrorCodes } from '../errors/interfaces/errorCodes.js';
import type { ApiResponse } from '../@types/http.js';
import type { UserResponseDTO } from '../models/user.js';

const userService = new UserService(prisma);


export async function getCurrentUserController(req: Request, res: Response) {
    if (!req.userId) {
        throw new AppError({
            message: "Unauthorized",
            errorCode: ErrorCodes.UNAUTHORIZED,
            statusCode: 401
        });
    }
    
    const user = await userService.getCurrentUser(req.userId);
    const body: ApiResponse<UserResponseDTO> = {
        success: true,
        data: user
    }

    return res.json(body);
}