import {type Request, type Response} from 'express';
import { UserService } from '../services/UserService.js';
import { prisma } from '../utils/prisma.js';
import type { ApiResponse } from '../@types/http.js';
import type { UserResponseDTO } from '../models/user.js';
import { assertUserIdxists } from '../utils/utils.js';

const userService = new UserService(prisma);


export async function getCurrentUserController(req: Request, res: Response) {
    assertUserIdxists(req.userId);
    
    const user = await userService.getCurrentUser(req.userId);
    const body: ApiResponse<UserResponseDTO> = {
        success: true,
        data: user
    }

    return res.json(body);
}