import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebaseAdmin.js";
import prisma from "../services/prismaService.js";

export interface AuthenticatedUser {
  uid: string;
  email: string;
  role: "USER" | "ADMIN";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const verifyAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  // Development Mock Header Support (useful when running locally before Firebase project is linked)
  const mockRole = req.headers["x-mock-role"] as string | undefined;
  if (process.env.NODE_ENV !== "production" && mockRole) {
    req.user = {
      uid: "mock-user-123",
      email: "client@maison-elegance.com",
      role: mockRole.toUpperCase() === "ADMIN" ? "ADMIN" : "USER",
    };
    return next();
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Authentication required",
      message: "Authorization Bearer token is missing or malformed.",
    });
    return;
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    
    // Check if user exists in database or retrieve role
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { firebaseUid: decodedToken.uid },
      });
    } catch {
      // Prisma offline fallback
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      role: (user?.role as "USER" | "ADMIN") || "USER",
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      error: "Unauthorized",
      message: "The provided authentication token is invalid or has expired.",
    });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if (req.user.role !== "ADMIN") {
    res.status(403).json({
      error: "Forbidden",
      message: "Access restricted to Haute Joaillerie Atelier Administrators only.",
    });
    return;
  }

  next();
};
