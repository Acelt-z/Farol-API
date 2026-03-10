import type { LoginDTO, SignUpDTO } from "../models/auth.js";
import bcrypt from "bcrypt";
import { ValidationError } from "../errors/ValidationError.js";
import type { ValidationItem } from "../errors/interfaces/errorTypes.js";
import type { PrismaClient } from "../generated/prisma/client.js";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/interfaces/errorCodes.js";
import { extractDigits, getTokenSecrets } from "../utils/utils.js";
import { parseIdentifier } from "../validations/authValidations.js";

const FAKE_HASH = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8l8Gk0z7s8AjtKoa6HgMHqmpYyqn1K";

export class AuthService {
  private ACCESS_SECRET: string;
  private REFRESH_SECRET: string;
  private ISSUER_SECRET: string;
  private saltRounds: number;

  constructor(private prisma: PrismaClient) {
    const {accessSecret, refreshSecret, issuerSecret} = getTokenSecrets();

    this.ACCESS_SECRET = accessSecret;
    this.REFRESH_SECRET = refreshSecret;
    this.ISSUER_SECRET = issuerSecret;
    this.saltRounds = Number.parseInt(process.env.SALT_ROUNDS ?? "10");
  }

  private generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { sub: userId },
      this.ACCESS_SECRET,
      { expiresIn: "15m", issuer: this.ISSUER_SECRET }
    );

    const refreshToken = jwt.sign(
      { sub: userId },
      this.REFRESH_SECRET,
      { expiresIn: "7d", issuer: this.ISSUER_SECRET }
    );

    return { accessToken, refreshToken };
  }

  async signUp(dto: SignUpDTO) {
    const normalizedCpf = extractDigits(dto.cpf);
    const normalizedPhone = extractDigits(dto.phone);
    const user = await this.prisma.$transaction(async (tx) => {
      const [emailExists, cpfExists, phoneExists] = await Promise.all([
        tx.user.findUnique({ where: { email: dto.email.trim() } }),
        tx.user.findUnique({ where: { cpf: normalizedCpf } }),
        tx.user.findUnique({ where: { phone: normalizedPhone } })
      ]);

      const errors: ValidationItem[] = [];

      if (emailExists) {
        errors.push({ field: "email", errorLabel: "Email already registered" });
      }

      if (cpfExists) {
        errors.push({ field: "cpf", errorLabel: "CPF already registered" });
      }


      if (phoneExists) {
        errors.push({ field: "phone", errorLabel: "Phone already registered" });
      }

      if (errors.length > 0) throw new ValidationError(errors);



      const hash = await bcrypt.hash(dto.password.trim(), this.saltRounds);

      return tx.user.create({
        data: {
          firstName: dto.firstName.trim(),
          lastName: dto.lastName.trim(),
          email: dto.email.trim(),
          cpf: normalizedCpf,
          phone: normalizedPhone,
          password: hash
        }
      });
    });

    return this.generateTokens(user.id);
  }

  async login(dto: LoginDTO) {
    const identifier = parseIdentifier(dto.identifier.trim());

    const user = await this.prisma.user.findUnique({
      where:
        identifier.type === "cpf"
          ? { cpf: identifier.value }
          : { email: identifier.value }
    });

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user?.password ?? FAKE_HASH);

    if (!user || !passwordMatches) {
      throw new AppError({
        message: "Invalid credentials",
        errorCode: ErrorCode.INVALID_CREDENTIALS,
      });
    }

    return this.generateTokens(user.id);
  }

  generateNewAccessToken(refreshToken: string){
    const payload = jwt.verify(
      refreshToken,
      this.REFRESH_SECRET
    ) as { sub: string };

    return jwt.sign(
      { sub: payload.sub },
      this.ACCESS_SECRET,
      { expiresIn: "15m", issuer: this.ISSUER_SECRET }
    );
  }
}

