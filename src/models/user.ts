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
    updatedAt: Date
}

export class UserMapper {
    static toResponse(u: User): UserResponseDTO{
        return {
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            cpf: u.cpf,
            phone: u.phone,
            emailVerified: u.emailVerified,
            phoneVerified: u.phoneVerified,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt
        };
    }
}