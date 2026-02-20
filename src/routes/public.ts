import { Router } from "express";

const router = Router();

router.get("/ping", (_req, res) => {
  res.status(200).json({ message: "Pong!" });
});

export default router;