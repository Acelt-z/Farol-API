import type { User } from "../generated/prisma/client.js";

export type UserResponseDTO = {
    id: string,
    firstName: string,
    lastName: string,
    cpf: string,
    email: string,
    phone?: string | null,
    emailVerified: boolean,
    phoneVerified: boolean,
    createdAt: Date,
    updatedAt: Date,
}

export class UserMapper {
    static toResponse(user: User): UserResponseDTO{
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            cpf: user.cpf,
            phone: user.phone,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}