import { Router } from "express";
import { registerUser } from "../services/auth.service.js";

const router = Router();

router.get("/ping", async (_req, res) => {
  await registerUser();
  res.status(200).json({ message: "Pong!" });
});

export default router;