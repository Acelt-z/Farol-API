import { Router } from "express";
import { getCurrentUserController } from "../controllers/user.controller.js";
import { createCompanyController } from "../controllers/company.controller.js";

const router = Router();


/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *       401:
 *         description: Unauthorized
 */
router.get('/me', async (req, res) => {
    await getCurrentUserController(req, res);
});

router.post('/company', async (req, res) => {
    await createCompanyController(req, res);
});

export default router;