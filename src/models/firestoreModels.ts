export enum Role {
  OWNER = "OWNER",
  MANAGER = "MANAGER",
  MEMBER = "MEMBER"
}

export enum CompanyStatus {
  TRIAL = "TRIAL",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  CANCELED = "CANCELED"
}

export enum PlanType {
  BASIC = "BASIC",
  PRO = "PRO",
  PREMIUM = "PREMIUM",
  ENTERPRISE = "ENTERPRISE"
}

export interface UserDoc {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  phone?: string | null;
  googleUid?: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  companyRoles: Array<{
    companyId: string;
    role: Role;
    isBillableUser: boolean;
  }>;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface CompanyDoc {
  id: string;
  name: string;
  cnpj: string;
  street: string;
  number: number;
  city: string;
  uf: string;
  zipCode: string;
  complement?: string | null;
  status: CompanyStatus;
  planId: string; // Ref to plans collection
  ownerId: string;
  parentCompanyId?: string | null; // For branches
  trialEndsAt?: string | null; // ISO String
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}

export interface PlanDoc {
  id: string;
  name: PlanType;
  maxUsers: number | null;
  pricePerUser: number;
}
