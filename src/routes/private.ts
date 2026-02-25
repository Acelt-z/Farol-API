import { Router } from "express";
import { getCurrentUserController } from "../controllers/user.controller.js";

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

export default router;