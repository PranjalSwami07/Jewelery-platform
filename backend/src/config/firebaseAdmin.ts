import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

let firebaseApp: admin.app.App | null = null;

try {
  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
    console.log("✓ Firebase Admin SDK initialized successfully");
  } else if (!admin.apps.length) {
    // Graceful fallback for local development without credentials
    firebaseApp = admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || "maison-elegance-dev",
    });
    console.log("ℹ Firebase Admin running in development mode");
  } else {
    firebaseApp = admin.app();
  }
} catch (error) {
  console.warn("⚠ Firebase Admin initialization warning (running in dev fallback):", error);
}

export const auth = admin.auth();
export default firebaseApp;
