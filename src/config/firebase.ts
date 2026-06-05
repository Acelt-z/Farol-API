import admin from "firebase-admin";
import { config } from "dotenv";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/interfaces/errorCodes.js";

config();

const projectId = process.env.FIREBASE_PROJECT_ID;

if (!projectId) {
  throw new AppError({
    message: "Missing FIREBASE_PROJECT_ID configuration",
    errorCode: ErrorCode.CONFIGURATION_ERROR,
  });
}

if (!admin.apps.length) {
  admin.initializeApp({
    projectId,
    ...(process.env.FIREBASE_STORAGE_BUCKET && {
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    }),
  });
}

export const adminAuth = admin.auth();
export const db = admin.firestore();
export default admin;
