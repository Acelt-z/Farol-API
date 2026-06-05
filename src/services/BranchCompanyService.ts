import { ValidationError } from "../errors/ValidationError.js";
import { CompanyStatus, Role, type CompanyDoc, type UserDoc } from "../models/firestoreModels.js";
import {
  BranchMapper,
  type BranchResponseDTO,
  type CreateBranchCompanyDTO,
} from "../models/branchCompany.js";
import { extractDigits } from "../utils/utils.js";
import { db } from "../config/firebase.js";
import { NotFoundError } from "../errors/NotFound.js";

export class BranchCompanyService {
  constructor() {}

  async createBranchCompany(
    dto: CreateBranchCompanyDTO,
    userId: string,
    parentCompanyId: string,
  ): Promise<BranchResponseDTO> {
    const normalizedCnpj = extractDigits(dto.cnpj);
    const branchId = db.collection("companies").doc().id;

    await db.runTransaction(async (transaction) => {
      const userRef = db.collection("users").doc(userId);
      const parentCompanyRef = db.collection("companies").doc(parentCompanyId);
      const cnpjQuery = db.collection("companies").where("cnpj", "==", normalizedCnpj).limit(1);
      const [userDoc, parentCompanyDoc, cnpjSnapshot] = await Promise.all([
        transaction.get(userRef),
        transaction.get(parentCompanyRef),
        transaction.get(cnpjQuery),
      ]);
      if (!userDoc.exists)
        throw new ValidationError([{ field: "userId", errorLabel: "User does not exist" }]);
      if (!cnpjSnapshot.empty)
        throw new ValidationError([{ field: "cnpj", errorLabel: "CNPJ already registered" }]);
      if (!parentCompanyDoc.exists)
        throw new ValidationError([
          { field: "parentCompanyId", errorLabel: "Parent company does not exist" },
        ]);
      const parentData = parentCompanyDoc.data() as CompanyDoc | undefined;
      const userData = userDoc.data() as UserDoc | undefined;
      if (!parentData || !userData) {
        throw new ValidationError([{ field: "data", errorLabel: "Required data is missing" }]);
      }
      const userRole = userData.companyRoles?.find((r) => r.companyId === parentCompanyId);
      if (!userRole || userRole.role === Role.MEMBER) {
        throw new ValidationError([{ field: "parentCompanyId", errorLabel: "Permission denied" }]);
      }
      const parentRoot = parentData.cnpj.substring(0, 8);
      const branchRoot = normalizedCnpj.substring(0, 8);
      if (parentRoot !== branchRoot) {
        throw new ValidationError([
          { field: "cnpj", errorLabel: "Branch CNPJ base does not match parent" },
        ]);
      }
      const newBranch: Omit<CompanyDoc, "id"> = {
        name: dto.name,
        cnpj: normalizedCnpj,
        street: dto.street,
        city: dto.city,
        uf: dto.uf,
        zipCode: dto.zipCode,
        number: dto.number,
        complement: dto.complement ?? null,
        ownerId: parentData.ownerId,
        parentCompanyId: parentCompanyId,
        status: CompanyStatus.ACTIVE,
        planId: parentData.planId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      transaction.set(db.collection("companies").doc(branchId), newBranch);
    });

    const branchSnap = await db.collection("companies").doc(branchId).get();
    const branchData = branchSnap.data() as Omit<CompanyDoc, "id"> | undefined;
    if (!branchData) throw new NotFoundError("Branch");

    const createdBranch: CompanyDoc = { id: branchSnap.id, ...branchData } as CompanyDoc;
    return BranchMapper.toCompleteResponse({ company: createdBranch, totalWorkers: 0 });
  }
}

