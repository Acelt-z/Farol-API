import {type Request, type Response} from 'express';
import { assertUserIdxists, getParsedData } from '../utils/utils.js';
import { CreateCompanySchema } from '../models/company.js';
import { CompanyService } from '../services/CompanyService.js';
import { prisma } from '../utils/prisma.js';

const companyService = new CompanyService(prisma);

export async function createCompanyController(req: Request, res: Response) {
    assertUserIdxists(req.userId);


    const result = CreateCompanySchema.safeParse(req.body);
    const data = getParsedData(result);
    
    const company = await companyService.createCompany(data, req.userId);
    
    return res.status(201).json({
        success: true,
        data: company
    });
}

export async function getUserCompaniesController(req: Request, res: Response) {
    assertUserIdxists(req.userId);

    
    const companies = await companyService.getUserCompanies(req.userId);
    
    return res.status(201).json({
        success: true,
        data: companies
    });
}

export async function getUserCompaniesCards(req: Request, res: Response) {
    assertUserIdxists(req.userId);
    
    const companies = await companyService.getUserCompaniesCard(req.userId);
    
    return res.status(200).json({
        success: true,
        data: companies
    });
}