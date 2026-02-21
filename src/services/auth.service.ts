import type { LoginDTO, SignUpDTO } from "../models/auth.js";
import bcrypt from "bcrypt";
import { prisma } from "../utils/prisma.js";
import { ValidationError } from "../errors/ValidationError.js";
import type { ValidationItem } from "../errors/interfaces/errorTypes.js";


export async function login(_dto: LoginDTO) {

}

export async function signUp(dto: SignUpDTO) {
    return await prisma.$transaction(async (tx) => {
        const [emailExists, cpfExists, phoneExists] = await Promise.all([
            tx.user.findUnique({ where: { email: dto.email.trim() } }),
            tx.user.findUnique({ where: { cpf: dto.cpf.trim() } }),
            tx.user.findUnique({ where: { phone: dto.phone.trim() } })
        ]);

        const errors: ValidationItem[] = [];

        if (emailExists) {
            errors.push({
                field: 'email',
                errorLabel: 'This emails is already registered'
            });
        }
        if (cpfExists) {
            errors.push({
                field: 'CPF',
                errorLabel: 'This CPF is already registered'
            });
        }
        if (phoneExists) {
            errors.push({
                field: 'phone',
                errorLabel: 'This phone is already registered'
            });
        }

        if (errors.length > 0) throw new ValidationError(errors);

        const saltRounds = process.env.SALT_ROUNDS ? Number(process.env.SALT_ROUNDS) : 10;
        const hash = await bcrypt.hash(dto.password, saltRounds);

        const newUser = await tx.user.create({
            data: {
                firstName: dto.firstName.trim(),
                lastName: dto.lastName.trim(),
                email: dto.email.trim(),
                cpf: dto.cpf.trim(),
                phone: dto.phone.trim(),
                password: hash,
            },
        });

        return newUser;
    });
}