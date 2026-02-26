import type { ValidationItem } from "../errors/interfaces/errorTypes.js";
import { ValidationError } from "../errors/ValidationError.js";
import { CompanyStatus, PlanType, Role, type PrismaClient } from "../generated/prisma/client.js";
import { CompanyMapper, type CompanyCardResponseDTO, type CompanyResponseDTO, type CreateCompanyDTO } from "../models/company.js";
import { addDaysToNow, DEFAULT_TRIAL_DAYS } from "../utils/utils.js";

export class CompanyService {
    constructor(private prisma: PrismaClient) {}

    async createCompany(dto: CreateCompanyDTO, userId: string): Promise<CompanyResponseDTO> {
        const normalizedCnpj = dto.cnpj.replace(/\D/g, "");

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
            CompanyMapper.toCompleteResponse({
                company: uc.company,
                totalWorkers: totalWorkers
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
}