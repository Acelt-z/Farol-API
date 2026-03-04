import { Router } from "express";
import { createCompanyController, updateCompanyController } from "../../controllers/company.controller.js";
import { createBranchCompanyController } from "../../controllers/branch.controller.js";

const router = Router();

router.post('/', async (req, res) => {
    await createCompanyController(req, res);
});

router.patch('/:companyId', async (req, res) => {
    await updateCompanyController(req, res);
});

router.patch('/:companyId/plan', async (_req, _res) => {
    // TODO: Make plan update
});

router.patch('/:companyId/status', async (_req, _res) => {
    // TODO: Suspend/cancel/reactivate
});

router.patch('/:companyId/transfer-ownership', async (_req, _res) => {
    // TODO: Make transfer ownership
});

router.delete('/:companyId', async (_req, _res) => {
    // TODO: Make company deletion
});


// -------- Branches ---------

router.post('/:parentCompanyId/branch', async (req, res) => {
    await createBranchCompanyController(req, res);
});


export default router;