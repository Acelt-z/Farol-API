import type { ResponseArgs } from "../@types/http.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/interfaces/errorCodes.js";
import { isBranch } from "../utils/utils.js";
import { type CompanyCardResponseDTO, type CompanyResponseDTO } from "./company.js";
import {z} from 'zod';

export const CreateBranchCompanySchema = z.object({
    name: z.string(),
    cnpj: z.string().min(14).max(18).refine((c) => isBranch(c), { message: "Invalid Branch" }),
    city: z.string(),
    uf: z.string().length(2),
    street: z.string(),
    zipCode: z.string().min(8).max(8),
    number: z.number(),
    complement: z.string().optional()
});


export type CreateBranchCompanyDTO = z.infer<typeof CreateBranchCompanySchema>;


export type BranchResponseDTO = Omit<CompanyResponseDTO, "planId" | "branches" | "trialEndsAt"> & {
  parentCompanyId: string;
};

export type BranchCardResponseDTO = Omit<CompanyCardResponseDTO, "planId" | "trialEndsAt"> & {
  parentCompanyId: string;
};

export const ParentCompanyParamSchema = z.object({
  parentCompanyId: z.uuid()
});

export class BranchMapper {
    static toCompleteResponse({company, totalWorkers}: ResponseArgs): BranchResponseDTO {
        if (!company.parentCompanyId) {
            throw new AppError({
                message: "A branch company must have an associated parent company",
                errorCode: ErrorCode.VALIDATION_ERROR
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
            status: company.status,
            ownerId: company.ownerId,
            parentCompanyId: company.parentCompanyId,
            createdAt: company.createdAt,
            updatedAt: company.updatedAt
        };
    }
}