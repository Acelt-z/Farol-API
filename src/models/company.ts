import { isCnpj } from "validator-brazil";
import type { Company } from "../generated/prisma/client.js";
import {z } from "zod";


export type CompanyResponseDTO = {
    id: string;
    name: string;
    totalWorkers: number;
    cnpj: string;
    city: string;
    uf: string;
    zipCode: string;
    number: number;
    complement?: string | null;
    trialEndsAt?: Date | null;
    planId: number;
    ownerId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export const CreateCompanySchema = z.object({
    name: z.string(),
    cnpj: z.string().min(14).max(14).refine((c) => isCnpj(c), { message: "Invalid CNPJ format" }),
    city: z.string(),
    uf: z.string().length(2),
    street: z.string(),
    zipCode: z.string().min(8).max(8),
    number: z.number(),
    complement: z.string().optional()
});

export type CreateCompanyDTO = z.infer<typeof CreateCompanySchema>;

type ResponseArgs = {company: Company, totalWorkers: number, userRole?: "OWNER" | "MEMBER" | null};

export class CompanyMapper {
    static toResponse({company, totalWorkers}: ResponseArgs): CompanyResponseDTO{
        return {
            id: company.id,
            name: company.name,
            cnpj: company.cnpj,
            city: company.city,
            uf: company.uf,
            zipCode: company.zipCode,
            number: company.number,
            complement: company.complement,
            totalWorkers,
            trialEndsAt: company.trialEndsAt || null,
            ownerId: company.ownerId,
            planId: company.planId,
            createdAt: company.createdAt,
            updatedAt: company.updatedAt
        };
    }
}