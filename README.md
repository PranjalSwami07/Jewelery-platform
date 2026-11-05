# Maison d'Élégance | Luxury 3D High Jewelry Platform

A modern, classic, and elegant e-commerce experience for high jewelry. Featuring a fixed 3D background animation reacting dynamically to user scroll, custom mouse-interactive luxury components, Cloudinary image optimization, strict role-based access control, an AI Concierge service, and automated email processing.

---

## Architecture & Tech Stack

### Monorepo Layout
- **`frontend/`**: Vite + React + TypeScript + Three.js / Canvas + Tailwind CSS + Framer Motion
- **`backend/`**: Express + TypeScript + Prisma ORM + Cloudinary SDK + Multer + Firebase Admin SDK + Nodemailer + Express Rate Limit

### Core Services
- **Database**: Supabase PostgreSQL managed via Prisma ORM
- **Media & Image Storage**: Cloudinary SDK + Multer in-memory storage for uploading, transforming, and serving optimized product images
- **Authentication & Security**: Firebase Auth with server-side Firebase Admin SDK middleware enforcing strict data isolation and role-based access control (`USER` vs `ADMIN`)
- **AI Concierge**: Express `/api/chat` endpoint powered by Gemini API with IP-based rate limiting
- **Email Service**: Nodemailer SMTP `/api/contact` endpoint for bespoke inquiry routing

---

## Directory & File Tree

```text
jewellery-store/
├── README.md
├── PROJECT_PLAN.md
├── .gitignore
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/
│       │   ├── cloudinary.ts
│       │   ├── firebaseAdmin.ts
│       │   └── nodemailer.ts
│       ├── controllers/
│       │   ├── authController.ts
│       │   ├── chatController.ts
│       │   ├── contactController.ts
│       │   ├── orderController.ts
│       │   └── productController.ts
│       ├── middleware/
│       │   ├── authMiddleware.ts
│       │   ├── uploadMiddleware.ts
│       │   └── rateLimiter.ts
│       ├── routes/
│       │   ├── adminRoutes.ts
│       │   ├── chatRoutes.ts
│       │   ├── contactRoutes.ts
│       │   ├── orderRoutes.ts
│       │   └── productRoutes.ts
│       ├── services/
│       │   ├── aiService.ts
│       │   ├── cloudinaryService.ts
│       │   ├── emailService.ts
│       │   └── prismaService.ts
│       └── app.ts
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── vite.config.ts
    └── src/
        ├── assets/
        ├── components/
        │   ├── 3d/
        │   │   └── BackgroundCanvas.tsx
        │   ├── common/
        │   │   ├── Footer.tsx
        │   │   └── Navbar.tsx
        │   ├── interactive/
        │   │   ├── CaratConfigurator.tsx
        │   │   ├── DiamondMagnifier.tsx
        │   │   ├── ParallaxBanner.tsx
        │   │   └── RingRotation360.tsx
        │   └── UI/
        │       ├── AIChatDrawer.tsx
        │       └── ScrollIndicator.tsx
        ├── context/
        │   ├── AuthContext.tsx
        │   └── CartContext.tsx
        ├── hooks/
        │   ├── useAuth.ts
        │   └── useScrollProgress.ts
        ├── pages/
        │   ├── AdminDashboard.tsx
        │   ├── Contact.tsx
        │   ├── Home.tsx
        │   ├── ProductDetail.tsx
        │   └── Shop.tsx
        ├── services/
        │   ├── api.ts
        │   └── firebase.ts
        ├── App.tsx
        └── main.tsx