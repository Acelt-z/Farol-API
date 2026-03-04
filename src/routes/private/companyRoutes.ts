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



router.post('/:parentCompanyId/branch', async (req, res) => {
    await createBranchCompanyController(req, res);
});

export default router;