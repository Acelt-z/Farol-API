import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/interfaces/errorCodes.js";
import type { ValidationItem } from "../errors/interfaces/errorTypes.js";
import { ValidationError } from "../errors/ValidationError.js";
import { CompanyStatus, PrismaClient, Role } from "../generated/prisma/client.js";
import { BranchMapper, type BranchResponseDTO, type CreateBranchCompanyDTO } from "../models/branchCompany.js";
import { extractDigits } from "../utils/utils.js";

export class BranchCompanyService {
    constructor(private prisma: PrismaClient) {}

    async createBranchCompany(dto: CreateBranchCompanyDTO, ownerId: string, parentCompanyId: string): Promise<BranchResponseDTO> {
        const normalizedCnpj = extractDigits(dto.cnpj);
        const branch = await this.prisma.$transaction(async (tx) => {
            const [userExists, cnpjExists, companyExists, userCompanyRelationExists] = await Promise.all([
                tx.user.findUnique({ where: { id: ownerId } }),
                tx.company.findUnique({ where: { cnpj: normalizedCnpj } }),
                tx.company.findUnique({ where: { id: parentCompanyId } }),
                tx.userCompany.findUnique({ where: { companyId_userId: { userId: ownerId, companyId: parentCompanyId } } })
            ]);

            const parentRoot = companyExists?.cnpj?.substring(0, 8);
            const branchRoot = normalizedCnpj.substring(0, 8);

            const errors: ValidationItem[] = [];

            const validations = [
                [!userExists, "userId", "User does not exist"],
                [cnpjExists, "cnpj", "CNPJ already registered"],
                [!companyExists, "parentCompanyId", "Parent company does not exist"],
                [companyExists?.status !== CompanyStatus.ACTIVE && companyExists?.status !== CompanyStatus.TRIAL, "parentCompanyId", "Parent company is not active"],
                [!userCompanyRelationExists, "parentCompanyId", "User is not associated with the parent company"],
                [userCompanyRelationExists?.role === Role.MEMBER, "parentCompanyId", "User does not have permission to create a branch for the parent company"],
                [companyExists && parentRoot !== branchRoot, "cnpj", "Branch CNPJ does not belong to the same company base number"]
            ] as const;
            
            for (const [condition, field, errorLabel] of validations) {
                if (condition) {
                    errors.push({ field: field, errorLabel: errorLabel });
                }
            }      

            if (errors.length > 0) {
                throw new ValidationError(errors);
            }

            const newBranch = await tx.company.create({
                data: {
                    name: dto.name,
                    cnpj: normalizedCnpj,

                    street: dto.street,
                    city: dto.city,
                    uf: dto.uf,
                    zipCode: dto.zipCode,
                    number: dto.number,
                    complement: dto.complement || null,

                    owner: {
                        connect: { id: (await this.getParentCompanyOwnerId(parentCompanyId)).ownerId }
                    },
                    parentCompany: {
                        connect: { id: parentCompanyId }
                    },

                    status: CompanyStatus.ACTIVE,
                }
            });

            return newBranch;
        });
    
        return BranchMapper.toCompleteResponse({company: branch, totalWorkers: 0});
    }

    private async getParentCompanyOwnerId(parentCompanyId: string): Promise<{ ownerId: string }> {
        const company = await this.prisma.company.findUnique({
            where: { id: parentCompanyId },
            select: { ownerId: true }
        });

        if (!company) {
            throw new AppError({
                message: "Parent company not found",
                errorCode: ErrorCode.NOT_FOUND
            });
        }

        return company;
    }
}
