import { ForbiddenError } from "../errors/Forbidden.js";
import type { ValidationItem } from "../errors/interfaces/errorTypes.js";
import { NotFoundError } from "../errors/NotFound.js";
import { ValidationError } from "../errors/ValidationError.js";
import { CompanyStatus, PlanType, Prisma, Role, type PrismaClient } from "../generated/prisma/client.js";
import { BranchMapper } from "../models/branchCompany.js";
import { CompanyMapper, type ChangePlanDTO, type CompanyCardResponseDTO, type CompanyResponseDTO, type CreateCompanyDTO, type UpdateCompanyDTO } from "../models/company.js";
import logger from "../utils/logger.js";
import { addDaysToNow, buildUpdateData, DEFAULT_TRIAL_DAYS, extractDigits } from "../utils/utils.js";

export class CompanyService {
    constructor(private prisma: PrismaClient) {}

    async createCompany(dto: CreateCompanyDTO, userId: string): Promise<CompanyResponseDTO> {
        const normalizedCnpj = extractDigits(dto.cnpj);

        const company = await this.prisma.$transaction(async (tx) => {
            const [userExists, cnpjExists] = await Promise.all([
                tx.user.findUnique({ where: { id: userId } }),
                tx.company.findUnique({ where: { cnpj: normalizedCnpj } })
            ]);

            const errors: ValidationItem[] = [];
            
            if (!userExists) {
                errors.push({ field: "userId", errorLabel: "User does not exist" });
                throw new ValidationError(errors);
            }
            
            if (cnpjExists) {
                errors.push({ field: "cnpj", errorLabel: "CNPJ already registered" });
            }

            if (errors.length > 0) {
                throw new ValidationError(errors);
            }

            const newCompany = await tx.company.create({
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
                        connect: { id: userId }
                    },

                    trialEndsAt: new Date(addDaysToNow(DEFAULT_TRIAL_DAYS)), // default trial days
                    plan: {
                        connect: { name: PlanType.BASIC }
                    },
                    status: CompanyStatus.TRIAL
                    
                }
            });
            
            await tx.userCompany.create({
                data: {
                    companyId: newCompany.id,
                    userId: userId,
                    role: Role.OWNER,
                    isBillableUser: true
                }
            });
            

            return newCompany;

        });

        return CompanyMapper.toCompleteResponse({company, totalWorkers: 1});
    }

    async getUserCompanies(userId: string): Promise<CompanyResponseDTO[]> {
        const userCompanies = await this.prisma.userCompany.findMany({
            where: { userId },
            include: {
                company: {
                    include: {
                        owner: true,
                        branchCompanies: {
                            include: {
                                _count: {
                                    select: { userCompanyRoles: true }
                                }
                            }
                        },
                        _count: {
                            select: { userCompanyRoles: true }
                        }
                    }
                }
            }
        });

        return userCompanies.map((uc) =>
            CompanyMapper.toCompleteResponse({
                company: uc.company,
                totalWorkers: uc.company._count.userCompanyRoles,
                branches: uc.company.branchCompanies.map((b) =>
                    BranchMapper.toCompleteResponse({
                        company: b,
                        totalWorkers: b._count.userCompanyRoles
                    })
                )
            })
        );
    }

    async getUserCompaniesCard(userId: string): Promise<CompanyCardResponseDTO[]> {
        const [userCompanies, totalWorkers] = await this.prisma.$transaction([
            this.prisma.userCompany.findMany({
                where: {
                    userId
                },
                include: {
                    company: {
                        include: {
                            owner: true
                        }
                    }
                }
            }),
            this.prisma.userCompany.count({
                where: {
                    userId
                }
            })
        ]);

        return userCompanies.map((uc) =>
            CompanyMapper.toCardResponse({
                company: uc.company,
                totalWorkers: totalWorkers
            })
        );
    }

    async updateCompany(companyId: string, dto: UpdateCompanyDTO, userId: string): Promise<CompanyResponseDTO> {
        const company = await this.prisma.$transaction(async (tx) => {
            const userCompanyRelation = await tx.userCompany.findUnique({
                    where: {
                        companyId_userId: {companyId, userId}
                    },
                    include: {
                        company: {
                            select: {
                                id: true,
                                status: true,
                                parentCompanyId: true
                            }
                        }
                    }
            });

            if (!userCompanyRelation || userCompanyRelation.role === Role.MEMBER) throw new ForbiddenError();

            const company = userCompanyRelation.company;

            if (!company) throw new NotFoundError('Company');

            if (company.parentCompanyId) {
                logger.warn('Attempt to update branch company via main update endpoint', {
                    companyId,
                    userId
                });
                
                throw new ForbiddenError();
            } 
            

            if (company.status === CompanyStatus.SUSPENDED || company.status === CompanyStatus.CANCELED) {
                throw new ForbiddenError('Company cannot be edited in current status');
            }

            const data = buildUpdateData(dto);

            if (Object.keys(data).length === 0) {
                throw new ValidationError([
                    { field: "body", errorLabel: "No fields provided for update" }
                ]);
            }

            const updatedCompany = await tx.company.update({
                where: { id: company.id },
                data: data
            });
            
            const workersCount = await tx.userCompany.count({
                where: { companyId: company.id }
            });

            return { updatedCompany, workersCount };
        });

        return CompanyMapper.toCompleteResponse({company: company.updatedCompany, totalWorkers: company.workersCount});
    }

    async changePlan(
        companyId: string,
        dto: ChangePlanDTO,
        userId: string
    ): Promise<CompanyCardResponseDTO> {

        const result = await this.prisma.$transaction(async (tx) => {

            const userCompanies = await this.getUserCompanyRelation(tx, userId, companyId);

            if (userCompanies.company.parentCompanyId) {
                throw new ForbiddenError(`Branch don't have permission to do this operation`);
            }

            const plan = await tx.plan.findUnique({
                where: {
                    name: dto.plan
                }
            });

            if (!plan) {
                throw new NotFoundError("Plan");
            }

            const updatedCompany = await tx.company.update({
                where: { id: companyId },
                data: {
                    plan: {
                        connect: {
                            id: plan.id
                        }
                    }
                },
                include: {
                    _count: {
                        select: { userCompanyRoles: true }
                    }
                }
            });

            return updatedCompany;
        });

        return CompanyMapper.toCompleteResponse({
            company: result,
            totalWorkers: result._count.userCompanyRoles
        });
    }

    private async getUserCompanyRelation(tx: Prisma.TransactionClient, userId: string, companyId: string) {
        const userCompanies = await tx.userCompany.findUnique({
            where: { companyId_userId: {userId, companyId } },
            include: {
                company: {
                    include: {
                        owner: true,
                        branchCompanies: {
                            include: {
                                _count: {
                                    select: { userCompanyRoles: true }
                                }
                            }
                        },
                        _count: {
                            select: { userCompanyRoles: true }
                        }
                    }
                }
            }
        });

        if (!userCompanies) throw new NotFoundError(`User and Company don't have any relation`);
        return userCompanies;
    }
}
