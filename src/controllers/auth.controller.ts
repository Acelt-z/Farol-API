import {type Request, type Response} from 'express';
import { AuthService } from '../services/AuthService.js';
import { LoginSchema, SignUpSchema } from '../models/auth.js';
import { getParsedData } from '../utils/utils.js';
import logger from '../utils/logger.js';
import { prisma } from '../utils/prisma.js';
import { AppError } from '../errors/AppError.js';
import { ErrorCode } from '../errors/interfaces/errorCodes.js';
import type { AccessTokenResponseDTO, ApiResponse } from '../@types/http.js';

const authService = new AuthService(prisma);

export async function loginController(req: Request, res: Response) {
    const result = LoginSchema.safeParse(req.body);
    const data = getParsedData(result);

    const { accessToken, refreshToken } = await authService.login(data);

    const body: ApiResponse<AccessTokenResponseDTO> = {
      success: true,
      data: {accessToken}
    };

    return res
        .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000 // 15 minutes
        })
        .json({ body });
}

export async function registerController(req: Request, res: Response) {
    logger.info(req.body);
    const result = SignUpSchema.safeParse(req.body);
    const data = getParsedData(result);

    const { accessToken, refreshToken } = await authService.signUp(data);

    const body: ApiResponse<AccessTokenResponseDTO> = {
      success: true,
      data: {accessToken}
    };

    return res
        .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000 // 15 minutes
        })
        .json({ body });
}



export async function refreshController(req: Request, res: Response) {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    throw new AppError({
      message: "Refresh token not provided",
      errorCode: ErrorCode.UNAUTHORIZED
    });
  }

  try {
    const newAccessToken = authService.generateNewAccessToken(refreshToken);

    const body: ApiResponse<AccessTokenResponseDTO> = {
      success: true,
      data: {accessToken: newAccessToken}
    };

    return res.status(200).json(body);
  } catch {
    throw new AppError({
      message: "Invalid refresh token",
      errorCode: ErrorCode.UNAUTHORIZED
    });
  }
}