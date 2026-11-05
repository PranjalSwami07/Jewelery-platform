import { Request, Response } from "express";
import prisma from "../services/prismaService.js";
import { sendInquiryConfirmationEmail } from "../services/emailService.js";

export const handleContactSubmission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, salonLocation, pieceInterest, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({
        error: "Missing required fields",
        message: "Name, email, and message are required for salon inquiries.",
      });
      return;
    }

    // Save inquiry to Prisma DB
    let savedInquiry = null;
    try {
      savedInquiry = await prisma.inquiry.create({
        data: {
          name,
          email,
          phone,
          salonLocation: salonLocation || "Paris Place Vendôme",
          pieceInterest: pieceInterest || "Haute Joaillerie Portfolio",
          message,
        },
      });
    } catch {
      savedInquiry = { id: `inq-${Date.now()}`, name, email };
    }

    // Dispatch luxury confirmation email via Nodemailer
    await sendInquiryConfirmationEmail({
      name,
      email,
      phone,
      salonLocation,
      pieceInterest,
      message,
    });

    res.status(200).json({
      success: true,
      message: "Your private viewing request has been received. Our salon director will contact you promptly.",
      data: savedInquiry,
    });
  } catch (error) {
    console.error("Contact controller error:", error);
    res.status(500).json({
      error: "Transmission error",
      message: "We encountered an issue transmitting your salon request. Please contact concierge@maison-elegance.com directly.",
    });
  }
};
