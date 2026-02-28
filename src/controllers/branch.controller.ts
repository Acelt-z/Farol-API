import { type Request, type Response } from "express";
import { BranchCompanyService } from "../services/BranchCompanyService.js";
import { prisma } from "../utils/prisma.js";
import { assertUserIdxists, getParsedData } from "../utils/utils.js";
import { CreateBranchCompanySchema, ParentCompanyParamSchema } from "../models/branchCompany.js";


const branchService = new BranchCompanyService(prisma);

export async function createBranchCompanyController(req: Request, res: Response) {
    assertUserIdxists(req.userId);

    const result = CreateBranchCompanySchema.safeParse(req.body);
    const data = getParsedData(result);

    
    const parameterParseResult = ParentCompanyParamSchema.safeParse(req.params);
    const paramData = getParsedData(parameterParseResult);

    const branch = await branchService.createBranchCompany(data, req.userId, paramData.parentCompanyId);
    
    return res.status(201).json({
        success: true,
        data: branch
    });
}