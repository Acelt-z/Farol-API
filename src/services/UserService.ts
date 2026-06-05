import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/interfaces/errorCodes.js";
import { UserMapper, type UserResponseDTO } from "../models/user.js";
import { db } from "../config/firebase.js";
import type { UserDoc } from "../models/firestoreModels.js";

export class UserService {
  constructor() {}

  async getCurrentUser(userId: string): Promise<UserResponseDTO> {
    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      throw new AppError({
        message: "User not authenticated",
        errorCode: ErrorCode.UNAUTHORIZED,
      });
    }

    const userData = userDoc.data() as Omit<UserDoc, "id"> | undefined;

    if (!userData) {
      throw new AppError({
        message: "User data is missing",
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }

    const user: UserDoc = { id: userDoc.id, ...userData };

    return UserMapper.toResponse(user);
  }
}
