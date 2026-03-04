import {type Request, type Response} from 'express';
import { assertUserIdxists, getParsedData } from '../utils/utils.js';
import { CompanyParamSchema, CreateCompanySchema, UpdateCompanySchema } from '../models/company.js';
import { CompanyService } from '../services/CompanyService.js';
import { prisma } from '../utils/prisma.js';
import { ErrorCode } from '../errors/interfaces/errorCodes.js';

const companyService = new CompanyService(prisma);

export async function createCompanyController(req: Request, res: Response) {
    assertUserIdxists(req.userId);

    const result = CreateCompanySchema.safeParse(req.body);
    const data = getParsedData(result, ErrorCode.VALIDATION_ERROR);
    
    const company = await companyService.createCompany(data, req.userId);
    
    return res.status(201).json({
        success: true,
        data: company
    });
}

export async function getUserCompaniesController(req: Request, res: Response) {
    assertUserIdxists(req.userId);
    
    const companies = await companyService.getUserCompanies(req.userId);
    
    return res.json({
        success: true,
        data: companies
    });
}

export async function getUserCompaniesCards(req: Request, res: Response) {
    assertUserIdxists(req.userId);
    
    const companies = await companyService.getUserCompaniesCard(req.userId);
    
    return res.json({
        success: true,
        data: companies
    });
}

export async function updateCompanyController(req: Request, res: Response) {
    assertUserIdxists(req.userId);

    const result = UpdateCompanySchema.safeParse(req.body);
    const data = getParsedData(result);

    const parameterParseResult = CompanyParamSchema.safeParse(req.params);
    const paramData = getParsedData(parameterParseResult);

    const updatedCompany = await companyService.updateCompany(paramData.companyId, data, req.userId);

    return res.json({
        success: true,
        data: updatedCompany
    });
    
}