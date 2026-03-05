import { Router } from "express";
import { getUserCompaniesCards, getUserCompaniesController } from "../../controllers/company.controller.js";
import { getCurrentUserController } from "../../controllers/user.controller.js";

const router = Router();

router.get('/', async (req, res) => {
    await getCurrentUserController(req, res);
});

router.get('/companies', async (req, res) => {
    await getUserCompaniesController(req, res);
});

router.get('/companies/cards', async (req, res) => {
    await getUserCompaniesCards(req, res);
});


export default router;