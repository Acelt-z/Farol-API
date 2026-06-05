import { isCnpj } from "validator-brazil";
import { PlanType, type CompanyStatus, type CompanyDoc } from "./firestoreModels.js";
import { z } from "zod";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/interfaces/errorCodes.js";
import type { BranchResponseDTO } from "./branchCompany.js";

export const CompanyParamSchema = z.object({
  companyId: z.string().min(1),
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
  trialEndsAt?: string | null;
  status: CompanyStatus;
  planId: string;
  ownerId: string;
  branches: BranchResponseDTO[];
  createdAt: string;
  updatedAt: string;
};

export type CompanyCardResponseDTO = {
  id: string;
  name: string;
  cnpj: string;
  city: string;
  uf: string;
  totalWorkers: number;
  trialEndsAt?: string | null;
  status: CompanyStatus;
  ownerId: string;
  planId: string;
  createdAt: string;
  updatedAt: string;
};

export const CreateCompanySchema = z.object({
  name: z.string(),
  cnpj: z
    .string()
    .min(14)
    .max(18)
    .refine((c) => isCnpj(c), { message: "Invalid CNPJ format" }),
  city: z.string(),
  uf: z.string().length(2),
  street: z.string(),
  zipCode: z.string().length(8),
  number: z.number(),
  complement: z.string().optional(),
});

export type CreateCompanyDTO = z.infer<typeof CreateCompanySchema>;

export const UpdateCompanySchema = z.object({
  name: z.string().optional(),
  city: z.string().optional(),
  uf: z.string().length(2).optional(),
  street: z.string().optional(),
  zipCode: z.string().length(8, "Zip code must contain exactly 8 characters").optional(),
  number: z.number().optional(),
  complement: z.string().optional(),
});

export type UpdateCompanyDTO = z.infer<typeof UpdateCompanySchema>;

export const ChangePlanSchema = z.object({
  plan: z.nativeEnum(PlanType),
});

export type ChangePlanDTO = z.infer<typeof ChangePlanSchema>;

export class CompanyMapper {
  static toCompleteResponse({
    company,
    totalWorkers,
    branches,
  }: {
    company: CompanyDoc;
    totalWorkers: number;
    branches?: BranchResponseDTO[];
  }): CompanyResponseDTO {
    if (!company.planId) {
      throw new AppError({
        message: "A company must have an associated plan",
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
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
      complement: company.complement ?? null,
      totalWorkers,
      branches: branches || [],
      trialEndsAt: company.trialEndsAt ?? null,
      status: company.status,
      ownerId: company.ownerId,
      planId: company.planId,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }

  static toCardResponse({
    company,
    totalWorkers,
  }: {
    company: CompanyDoc;
    totalWorkers: number;
  }): CompanyCardResponseDTO {
    if (!company.planId) {
      throw new AppError({
        message: "A company must have an associated plan",
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }

    return {
      id: company.id,
      name: company.name,
      cnpj: company.cnpj,
      city: company.city,
      uf: company.uf,
      totalWorkers,
      trialEndsAt: company.trialEndsAt ?? null,
      status: company.status,
      ownerId: company.ownerId,
      planId: company.planId,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }
}
