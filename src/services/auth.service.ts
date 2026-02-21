import type { LoginDTO, SignUpDTO } from "../models/auth.js";
import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma.js";


export async function login(_dto: LoginDTO) {

}

export async function signUp(dto: SignUpDTO) {
    const hash = await bcrypt.hash(dto.password, process.env.SALT_ROUNDS ?? 6);
    const newUser = {...dto, password: hash};
    return await prisma.user.create({data: newUser});
}