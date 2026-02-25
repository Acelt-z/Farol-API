import {type Request, type Response} from 'express';
import { getParsedData } from '../utils/utils.js';
import { CreateCompanySchema } from '../models/company.js';
import { ErrorCodes } from '../errors/interfaces/errorCodes.js';
import { AppError } from '../errors/AppError.js';
import { CompanyService } from '../services/CompanyService.js';
import { prisma } from '../utils/prisma.js';

const companyService = new CompanyService(prisma);

export async function createCompanyController(req: Request, res: Response) {
    if (!req.userId) {
        throw new AppError({
            message: "Unauthorized",
            errorCode: ErrorCodes.UNAUTHORIZED,
            statusCode: 401
        });
    }


    const result = CreateCompanySchema.safeParse(req.body);
    const data = getParsedData(result);
    
    const company = await companyService.createCompany(data, req.userId);
    
    return res.status(201).json({
        success: true,
        data: company
    });
}