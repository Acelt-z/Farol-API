import { Router } from "express";
import { getCurrentUserController } from "../controllers/user.controller.js";

const router = Router();

router.get('/me', async (req, res) => {
    await getCurrentUserController(req, res);
});

export default router;