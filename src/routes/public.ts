import { Router } from "express";
import { loginController, refreshController, registerController } from "../controllers/auth.controller.js";

const router = Router();

router.get("/ping", async (_req, res) => {
  res.status(200).json({ message: "Pong!" });
});

router.post('/login', async (req, res) => {
 await loginController(req, res);
});

router.post('/signUp', async (req, res) => {
 await registerController(req, res);
});


router.post('/refresh', async (req, res) => {
    await refreshController(req, res);
});

export default router;