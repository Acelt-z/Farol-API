import admin from "firebase-admin";
import { config } from "dotenv";
import { AppError } from "../errors/AppError.js";
import { ErrorCode } from "../errors/interfaces/errorCodes.js";

config();

const projectId =
  process.env.FB_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;

if (!projectId) {
  throw new AppError({
    message: "Missing Firebase Project ID configuration (FB_PROJECT_ID)",
    errorCode: ErrorCode.CONFIGURATION_ERROR,
  });
}

if (!admin.apps.length) {
  const options: admin.AppOptions = {
    projectId,
  };

  const storageBucket = process.env.FB_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET;
  if (storageBucket) {
    options.storageBucket = storageBucket;
  }

  admin.initializeApp(options);
}

export const adminAuth = admin.auth();
export const db = admin.firestore();
export default admin;
