import { ForbiddenError } from "../errors/Forbidden.js";
import { NotFoundError } from "../errors/NotFound.js";
import { ValidationError } from "../errors/ValidationError.js";
import { Role, CompanyStatus, type CompanyDoc, type UserDoc } from "../models/firestoreModels.js";
import { BranchMapper } from "../models/branchCompany.js";
import {
  CompanyMapper,
  type ChangePlanDTO,
  type CompanyCardResponseDTO,
  type CompanyResponseDTO,
  type CreateCompanyDTO,
  type UpdateCompanyDTO,
} from "../models/company.js";
import {
  addDaysToNow,
  buildUpdateData,
  DEFAULT_TRIAL_DAYS,
  extractDigits,
} from "../utils/utils.js";
import { db } from "../config/firebase.js";

export class CompanyService {
  constructor() {}

  async createCompany(dto: CreateCompanyDTO, userId: string): Promise<CompanyResponseDTO> {
    const normalizedCnpj = extractDigits(dto.cnpj);

    const companyId = db.collection("companies").doc().id;

    await db.runTransaction(async (transaction) => {
      const userRef = db.collection("users").doc(userId);
      const cnpjQuery = db.collection("companies").where("cnpj", "==", normalizedCnpj).limit(1);

      const [userDoc, cnpjSnapshot] = await Promise.all([
        transaction.get(userRef),
        transaction.get(cnpjQuery),
      ]);

      if (!userDoc.exists) {
        throw new ValidationError([{ field: "userId", errorLabel: "User does not exist" }]);
      }

      if (!cnpjSnapshot.empty) {
        throw new ValidationError([{ field: "cnpj", errorLabel: "CNPJ already registered" }]);
      }

      const newCompany: CompanyDoc = {
        id: companyId,
        name: dto.name,
        cnpj: normalizedCnpj,
        street: dto.street,
        city: dto.city,
        uf: dto.uf,
        zipCode: dto.zipCode,
        number: dto.number,
        complement: dto.complement ?? null,
        ownerId: userId,
        trialEndsAt: new Date(addDaysToNow(DEFAULT_TRIAL_DAYS)).toISOString(),
        planId: "plan_basic", // Placeholder for actual plan ID
        status: CompanyStatus.TRIAL,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const userData = userDoc.data() as UserDoc | undefined;
      const updatedRoles = [
        ...(userData?.companyRoles || []),
        {
          companyId: companyId,
          role: Role.OWNER,
          isBillableUser: true,
        },
      ];

      transaction.set(db.collection("companies").doc(companyId), newCompany);
      transaction.update(userRef, {
        companyRoles: updatedRoles,
        updatedAt: new Date().toISOString(),
      });
    });

    const companySnap = await db.collection("companies").doc(companyId).get();
    const companyData = companySnap.data() as Omit<CompanyDoc, "id"> | undefined;
    if (!companyData) throw new NotFoundError("Company");

    const createdCompany: CompanyDoc = { id: companySnap.id, ...companyData } as CompanyDoc;
    return CompanyMapper.toCompleteResponse({ company: createdCompany, totalWorkers: 1 });
  }

  async getUserCompanies(userId: string): Promise<CompanyResponseDTO[]> {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) return [];

    const userData = userDoc.data() as UserDoc | undefined;
    const roles = userData?.companyRoles || [];

    const companies: CompanyResponseDTO[] = [];

    for (const role of roles) {
      const companyDoc = await db.collection("companies").doc(role.companyId).get();
      if (companyDoc.exists) {
        const companyDataRaw = companyDoc.data() as Omit<CompanyDoc, "id"> | undefined;
        if (!companyDataRaw) continue;

        const companyData: CompanyDoc = { id: companyDoc.id, ...companyDataRaw };

        // Fetch workers count
        const workersSnapshot = await db.collection("users").get();
        const workersCount = workersSnapshot.docs.filter((doc) => {
          const data = doc.data() as UserDoc | undefined;
          return data?.companyRoles?.some((r) => r.companyId === role.companyId);
        }).length;

        // Fetch branches
        const branchesSnapshot = await db
          .collection("companies")
          .where("parentCompanyId", "==", role.companyId)
          .get();
        const branches = branchesSnapshot.docs
          .map((doc) => {
            const branchDataRaw = doc.data() as Omit<CompanyDoc, "id"> | undefined;
            if (!branchDataRaw) return null;
            return BranchMapper.toCompleteResponse({
              company: { id: doc.id, ...branchDataRaw } as CompanyDoc,
              totalWorkers: 0,
            });
          })
          .filter((b): b is NonNullable<typeof b> => b !== null);

        companies.push(
          CompanyMapper.toCompleteResponse({
            company: companyData,
            totalWorkers: workersCount,
            branches,
          }),
        );
      }
    }

    return companies;
  }

  async getUserCompaniesCard(userId: string): Promise<CompanyCardResponseDTO[]> {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) return [];

    const userData = userDoc.data() as UserDoc | undefined;
    const roles = userData?.companyRoles || [];

    const cards: CompanyCardResponseDTO[] = [];

    for (const role of roles) {
      const companyDoc = await db.collection("companies").doc(role.companyId).get();
      if (companyDoc.exists) {
        const companyDataRaw = companyDoc.data() as Omit<CompanyDoc, "id"> | undefined;
        if (!companyDataRaw) continue;

        const companyData: CompanyDoc = { id: companyDoc.id, ...companyDataRaw };

        const workersSnapshot = await db.collection("users").get();
        const workersCount = workersSnapshot.docs.filter((doc) => {
          const data = doc.data() as UserDoc | undefined;
          return data?.companyRoles?.some((r) => r.companyId === role.companyId);
        }).length;

        cards.push(
          CompanyMapper.toCardResponse({
            company: companyData,
            totalWorkers: workersCount,
          }),
        );
      }
    }

    return cards;
  }

  async updateCompany(
    companyId: string,
    dto: UpdateCompanyDTO,
    userId: string,
  ): Promise<CompanyResponseDTO> {
    const userRef = db.collection("users").doc(userId);
    const companyRef = db.collection("companies").doc(companyId);

    return await db.runTransaction(async (transaction) => {
      const [userDoc, companyDoc] = await Promise.all([
        transaction.get(userRef),
        transaction.get(companyRef),
      ]);

      if (!userDoc.exists) throw new NotFoundError("User");
      if (!companyDoc.exists) throw new NotFoundError("Company");

      const userData = userDoc.data() as UserDoc;
      const companyData = companyDoc.data() as CompanyDoc;

      const userRole = userData.companyRoles?.find((r) => r.companyId === companyId);
      if (!userRole || userRole.role === Role.MEMBER) throw new ForbiddenError();

      if (companyData.parentCompanyId)
        throw new ForbiddenError("Cannot update branch via this endpoint");

      if (
        companyData.status === CompanyStatus.SUSPENDED ||
        companyData.status === CompanyStatus.CANCELED
      ) {
        throw new ForbiddenError("Company cannot be edited in current status");
      }

      const updateData = buildUpdateData(dto);
      const finalUpdate = { ...updateData, updatedAt: new Date().toISOString() };
      transaction.update(companyRef, finalUpdate);

      const updatedCompany: CompanyDoc = { ...companyData, ...finalUpdate } as CompanyDoc;
      return CompanyMapper.toCompleteResponse({ company: updatedCompany, totalWorkers: 0 });
    });
  }

  async changePlan(
    companyId: string,
    dto: ChangePlanDTO,
    userId: string,
  ): Promise<CompanyResponseDTO> {
    const companyRef = db.collection("companies").doc(companyId);

    return await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(db.collection("users").doc(userId));
      const companyDoc = await transaction.get(companyRef);

      if (!userDoc.exists || !companyDoc.exists) throw new NotFoundError("User or Company");

      const userData = userDoc.data() as UserDoc;
      const companyData = companyDoc.data() as CompanyDoc;

      const userRole = userData.companyRoles?.find((r) => r.companyId === companyId);
      if (!userRole || userRole.role !== Role.OWNER) throw new ForbiddenError();

      transaction.update(companyRef, { planId: dto.plan, updatedAt: new Date().toISOString() });

      const updatedCompany: CompanyDoc = {
        ...companyData,
        planId: dto.plan,
        updatedAt: new Date().toISOString(),
      };
      return CompanyMapper.toCompleteResponse({ company: updatedCompany, totalWorkers: 0 });
    });
  }
}
