import { Request, Response } from "express";
import prisma from "../services/prismaService.js";

export const syncUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const { name } = req.body;

    let dbUser = null;
    try {
      dbUser = await prisma.user.upsert({
        where: { firebaseUid: user.uid },
        update: {
          email: user.email,
          ...(name ? { name } : {}),
        },
        create: {
          firebaseUid: user.uid,
          email: user.email,
          name: name || null,
          role: user.role || "USER",
        },
      });
    } catch {
      dbUser = { firebaseUid: user.uid, email: user.email, role: user.role };
    }

    res.status(200).json({
      success: true,
      data: dbUser,
    });
  } catch (error) {
    console.error("Auth sync error:", error);
    res.status(500).json({ error: "Failed to synchronize client profile." });
  }
};
