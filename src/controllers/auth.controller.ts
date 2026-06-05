import { type Request, type Response } from "express";
import { AuthService } from "../services/AuthService.js";
import { GoogleSignInSchema } from "../models/auth.js";
import { getParsedData } from "../utils/utils.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/interfaces/errorCodes.js";
import type { ApiResponse } from "../@types/http.js";
import { UserMapper, type UserResponseDTO } from "../models/user.js";

const authService = new AuthService();

export async function googleSignIn(req: Request, res: Response) {
  try {
    const result = GoogleSignInSchema.safeParse(req.body);
    const data = getParsedData(result);

    const userDoc = await authService.googleSignIn(data);
    const user = UserMapper.toResponse(userDoc);

    const body: ApiResponse<UserResponseDTO> = {
      success: true,
      data: user,
    };

    return res.status(200).json(body);
  } catch (err) {
    if (err instanceof AppError) throw err;

    throw new AppError({
      message: "Google sign-in failed",
      errorCode: ErrorCode.INVALID_CREDENTIALS,
    });
  }
}
