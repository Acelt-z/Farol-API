import type { UserDoc } from "./firestoreModels.js";

export type UserResponseDTO = {
  id: string;
  firstName: string;
  lastName: string;
  cpf: string;
  email: string;
  phone?: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export class UserMapper {
  static toResponse(u: UserDoc): UserResponseDTO {
    return {
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      cpf: u.cpf,
      phone: u.phone ?? null,
      emailVerified: u.emailVerified,
      phoneVerified: u.phoneVerified,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }
}
