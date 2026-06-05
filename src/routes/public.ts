import { Router } from "express";
import { googleSignIn } from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/google", async (req, res) => {
    await googleSignIn(req, res);
});

export default router;