import { Router } from "express";
import { googleSignIn } from "../controllers/auth.controller.js";
import { AppError } from "../errors/AppError.js";
import { UserService } from "../services/UserService.js";
import { ErrorCode } from "../errors/interfaces/errorCodes.js";

const router = Router();

router.post("/auth/google", async (req, res) => {
  await googleSignIn(req, res);
});

router.get("/ping", async (req, res) => {
  const userService = new UserService();
  try {
    const body = req.body! as { id: string };
    if (!body) throw new AppError({ errorCode: ErrorCode.CONFIGURATION_ERROR, message: "da ndao" });

    const user = await userService.getCurrentUser(body.id);
    return res.status(200).json(user);
  } catch (err) {
    if (err instanceof AppError) throw err;
  }
});

export default router;
