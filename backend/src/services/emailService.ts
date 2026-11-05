import transporter, { defaultSender } from "../config/nodemailer.js";

export interface SendInquiryEmailParams {
  name: string;
  email: string;
  phone?: string;
  salonLocation?: string;
  pieceInterest?: string;
  message: string;
}

export const sendInquiryConfirmationEmail = async (
  params: SendInquiryEmailParams
): Promise<boolean> => {
  const { name, email, salonLocation, pieceInterest, message } = params;

  const htmlContent = `
    <div style="font-family: 'Georgia', serif; background-color: #070707; color: #ededed; padding: 40px; border: 1px solid #C5A059;">
      <div style="text-align: center; border-bottom: 1px solid rgba(197,160,89,0.3); padding-bottom: 20px;">
        <h1 style="color: #FAF7EE; letter-spacing: 4px; font-weight: normal; margin: 0;">MAISON D'ÉLÉGANCE</h1>
        <p style="color: #C5A059; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-top: 5px;">Haute Joaillerie • Place Vendôme, Paris</p>
      </div>

      <div style="padding: 30px 10px; line-height: 1.8;">
        <p>Dear ${name},</p>
        <p>Thank you for expressing your esteemed interest in Maison d'Élégance.</p>
        <p>Your inquiry regarding <strong>${pieceInterest || "Haute Joaillerie Portfolio"}</strong> for our salon in <strong>${salonLocation || "Place Vendôme"}</strong> has been directly conveyed to our Senior Salon Director.</p>
        
        <blockquote style="border-left: 2px solid #C5A059; padding-left: 15px; margin: 20px 0; color: #A9853C; font-style: italic;">
          "${message}"
        </blockquote>

        <p>A private client advisor will contact you within 24 business hours to arrange your discreet viewing with Champagne hospitality.</p>
        
        <p style="margin-top: 30px;">With our highest regards,<br/>
        <strong style="color: #FAF7EE;">The Private Concierge Directorate</strong><br/>
        26 Place Vendôme, 75001 Paris</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: defaultSender,
      to: email,
      subject: `Private Salon Confirmation • Maison d'Élégance [${pieceInterest || "Bespoke Inquiry"}]`,
      html: htmlContent,
    });

    console.log("✓ Inquiry confirmation email dispatched:", info.messageId);
    return true;
  } catch (error) {
    console.warn("⚠ Email delivery note (SMTP not configured or in dev mode):", error);
    return false;
  }
};
