import { isCnpj } from "validator-brazil";
import type { CompanyStatus } from "../generated/prisma/client.js";
import {z } from "zod";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/interfaces/errorCodes.js";
import type { BranchResponseDTO } from "./branchCompany.js";
import type { ResponseArgs } from "../@types/http.js";

export const CompanyParamSchema = z.object({
  companyId: z.uuid()
});


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
    status: CompanyStatus;
    planId: number;
    ownerId: string;
    branches: BranchResponseDTO[];
    createdAt: Date;
    updatedAt: Date;
}

export type CompanyCardResponseDTO = {
    id: string;
    name: string;
    cnpj: string;
    city: string;
    uf: string;
    totalWorkers: number;
    trialEndsAt?: Date | null;
    status: CompanyStatus;
    ownerId: string;
    planId: number;
    createdAt: Date;
    updatedAt: Date;
}

export const CreateCompanySchema = z.object({
    name: z.string(),
    cnpj: z.string().min(14).max(18).refine((c) => isCnpj(c), { message: "Invalid CNPJ format" }),
    city: z.string(),
    uf: z.string().length(2),
    street: z.string(),
    zipCode: z.string().length(8),
    number: z.number(),
    complement: z.string().optional()
});

export type CreateCompanyDTO = z.infer<typeof CreateCompanySchema>;

export const UpdateCompanySchema = z.object({
    name: z.string().optional(),
    city: z.string().optional(),
    uf: z.string().length(2).optional(),
    street: z.string().optional(),
    zipCode: z.string().length(8, 'Zip code must contain exactly 8 characters').optional(),
    number: z.number().optional(),
    complement: z.string().optional()
});

export type UpdateCompanyDTO = z.infer<typeof UpdateCompanySchema>;


export class CompanyMapper {
    static toCompleteResponse({company, totalWorkers, branches}: ResponseArgs): CompanyResponseDTO{
        if (!company.planId) {
            throw new AppError({
                message: "A company must have an associated plan",
                errorCode: ErrorCode.INTERNAL_SERVER_ERROR
            });
        }

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
            branches: branches || [],
            trialEndsAt: company.trialEndsAt,
            status: company.status,
            ownerId: company.ownerId,
            planId: company.planId,
            createdAt: company.createdAt,
            updatedAt: company.updatedAt
        };
    }

    static toCardResponse({company, totalWorkers}: ResponseArgs): CompanyCardResponseDTO{
        if (!company.planId) {
            throw new AppError({
                message: "A company must have an associated plan",
                errorCode: ErrorCode.INTERNAL_SERVER_ERROR
            });
        }
        
        return {
            id: company.id,
            name: company.name,
            cnpj: company.cnpj,
            city: company.city,
            uf: company.uf,
            totalWorkers,
            trialEndsAt: company.trialEndsAt || null,
            status: company.status,
            ownerId: company.ownerId,
            planId: company.planId,
            createdAt: company.createdAt,
            updatedAt: company.updatedAt
        };
    }
}

