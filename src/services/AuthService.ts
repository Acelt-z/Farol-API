import type { GoogleSignInDTO } from "../models/auth.js";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/interfaces/errorCodes.js";
import { adminAuth, db } from "../config/firebase.js";
import type { UserDoc } from "../models/firestoreModels.js";

export class AuthService {
  constructor() {}

  async googleSignIn(dto: GoogleSignInDTO): Promise<UserDoc> {
    const decodedToken = await adminAuth.verifyIdToken(dto.idToken).catch(() => {
      throw new AppError({
        message: "Invalid Google ID token",
        errorCode: ErrorCode.INVALID_CREDENTIALS,
      });
    });

    if (!decodedToken.uid || !decodedToken.email) {
      throw new AppError({
        message: "Invalid Google token payload",
        errorCode: ErrorCode.INVALID_CREDENTIALS,
      });
    }

    const email = decodedToken.email.toLowerCase().trim();
    const displayName = (decodedToken["name"] as string | undefined) || "";
    const nameParts = displayName.trim().split(" ");
    const firstName = nameParts.shift() ?? "Usuário";
    const lastName = nameParts.join(" ") || "Google";

    const userRef = db.collection("users").doc(decodedToken.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const newUser: Omit<UserDoc, "id"> = {
        firstName,
        lastName,
        email,
        cpf: "",
        phone: "",
        googleUid: decodedToken.uid,
        emailVerified: decodedToken.email_verified ?? false,
        phoneVerified: false,
        companyRoles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await userRef.set(newUser);
      return { id: decodedToken.uid, ...newUser } as UserDoc;
    }

    const userData = userDoc.data() as Omit<UserDoc, "id"> | undefined;

    if (!userData) {
      throw new AppError({
        message: "User data is missing",
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
      });
    }

    return { id: userDoc.id, ...userData } as UserDoc;
  }
}
