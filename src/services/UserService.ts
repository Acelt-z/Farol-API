import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/interfaces/errorCodes.js";
import type { PrismaClient } from "../generated/prisma/client.js";
import { UserMapper, type UserResponseDTO } from "../models/user.js";

export class UserService {
    constructor(private prisma: PrismaClient){}

    async getCurrentUser(userId: string): Promise<UserResponseDTO>{
        const user = await this.prisma.user.findUnique({where: {id: userId}});
        if (!user) {
            throw new AppError({
                message: 'User not found',
                errorCode: ErrorCodes.NOT_FOUND,
                statusCode: 404,
            });
        }

        return UserMapper.toResponse(user);
    }

}