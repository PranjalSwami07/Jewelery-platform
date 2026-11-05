import { Request, Response } from "express";
import prisma from "../services/prismaService.js";

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const { items, salonLocation, appointmentDate } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "At least one creation is required to create a reservation." });
      return;
    }

    // Ensure user exists in Prisma
    let dbUser = await prisma.user.findUnique({ where: { firebaseUid: user.uid } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          firebaseUid: user.uid,
          email: user.email,
        },
      });
    }

    const totalAmount = items.reduce(
      (sum: number, it: any) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: dbUser.id,
        totalAmount,
        salonLocation: salonLocation || "Paris Place Vendôme",
        appointmentDate: appointmentDate ? new Date(appointmentDate) : null,
        status: "CONFIRMED",
        items: {
          create: items.map((it: any) => ({
            productId: it.productId,
            price: Number(it.price) || 0,
            quantity: Number(it.quantity) || 1,
            selectedMetal: it.selectedMetal || "Platinum 950",
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Haute joaillerie acquisition and private salon reservation confirmed.",
      data: order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Failed to create acquisition order." });
  }
};

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    // Enforce data isolation: query strictly by req.user.uid
    const dbUser = await prisma.user.findUnique({
      where: { firebaseUid: user.uid },
    });

    if (!dbUser) {
      res.status(200).json({ success: true, count: 0, data: [] });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { userId: dbUser.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ error: "Failed to retrieve user acquisitions." });
  }
};
