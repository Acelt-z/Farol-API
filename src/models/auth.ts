import { isCpf } from 'validator-brazil';
import { z } from 'zod';


export const LoginSchema = z.object({
  identifier: z.string().min(1, 'Email or CPF is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

export const SignUpSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    cpf: z.string("Invalid CPF format").min(11, 'Must contain at least 11 characters').refine((c) => isCpf(c)),
    email: z.email(),
    phone: z.string('Phone is required').startsWith('+').min(8),

    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character')
});

export type SignUpDTO = z.infer<typeof SignUpSchema>;