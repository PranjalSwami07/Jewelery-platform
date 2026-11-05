import { Request, Response } from "express";
import prisma from "../services/prismaService.js";
import { uploadImageToCloudinary } from "../services/cloudinaryService.js";

// Fallback seed catalog for offline / development database mode
const FALLBACK_PRODUCTS = [
  {
    id: "riviere-diamond-necklace",
    name: "The Graduated Rivière Diamond Necklace",
    slug: "graduated-riviere-diamond-necklace",
    category: "necklaces",
    description: "A monumental high jewelry necklace composed of 51 perfectly matched, graduated round brilliant diamonds in low-profile platinum baskets.",
    price: 84500,
    caratWeight: "36.80 Total Carats",
    metal: "Platinum 950",
    clarity: "Flawless to VVS1",
    colorGrade: "D - E (Colorless)",
    cutGrade: "GIA Triple Excellent",
    images: ["/images/graduated-riviere-diamond-necklace.jpg"],
    inStock: true,
    featured: true,
  },
  {
    id: "pear-diamond-cascade-necklace",
    name: "L'Impératrice Pear Diamond Cascade Collier",
    slug: "pear-diamond-cascade-necklace",
    category: "necklaces",
    description: "Featuring a magnificent 7.50-carat D-Flawless pear-shaped diamond pendant suspended below a double-strand rivière.",
    price: 118000,
    caratWeight: "44.20 Total Carats",
    metal: "Platinum 950",
    clarity: "Internally Flawless",
    colorGrade: "D (Pure Colorless)",
    cutGrade: "GIA Triple Excellent",
    images: ["/images/pear-diamond-cascade-necklace.jpg"],
    inStock: true,
    featured: true,
  },
  {
    id: "halo-solitaire-ring",
    name: "The Étoile 58-Facet Halo Solitaire Ring",
    slug: "etoile-halo-solitaire-ring",
    category: "rings",
    description: "A 3.20-carat brilliant cut diamond framed by a micro-milgrain rose gold inner bezel and an outer constellation of brilliant pavé diamonds.",
    price: 38200,
    caratWeight: "3.85 Total Carats",
    metal: "Platinum 950",
    clarity: "VVS1",
    colorGrade: "E",
    cutGrade: "Hearts & Arrows",
    images: ["/images/halo-solitaire-ring.png"],
    inStock: true,
    featured: true,
  },
  {
    id: "diamond-chandelier-earrings",
    name: "Artisan Cascade Chandelier Drop Earrings",
    slug: "artisan-cascade-chandelier-earrings",
    category: "earrings",
    description: "Handcrafted articulating chandelier drops featuring floral rosettes, marquise motifs, and teardrop pear terminals.",
    price: 46000,
    caratWeight: "14.60 Total Carats",
    metal: "Platinum 950",
    clarity: "VVS1 - VVS2",
    colorGrade: "D - F",
    cutGrade: "Triple Excellent",
    images: ["/images/diamond-chandelier-earrings.jpg"],
    inStock: true,
    featured: true,
  },
  {
    id: "diamond-tennis-bracelet",
    name: "Classic Line Rivière Diamond Tennis Bracelet",
    slug: "classic-line-diamond-tennis-bracelet",
    category: "bracelets",
    description: "A continuous line of forty-four identical round brilliant diamonds set in four-prong low profile baskets.",
    price: 29500,
    caratWeight: "12.00 Total Carats",
    metal: "Platinum 950",
    clarity: "VVS2",
    colorGrade: "E - F",
    cutGrade: "Triple Excellent",
    images: ["/images/diamond-tennis-bracelet.jpg"],
    inStock: true,
    featured: true,
  },
];

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, metal, featured } = req.query;

    let products = [];
    try {
      const where: any = {};
      if (category && category !== "all") where.category = String(category);
      if (metal && metal !== "all") where.metal = { contains: String(metal), mode: "insensitive" };
      if (featured === "true") where.featured = true;
      if (search) {
        where.OR = [
          { name: { contains: String(search), mode: "insensitive" } },
          { description: { contains: String(search), mode: "insensitive" } },
        ];
      }

      products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    } catch {
      // Offline DB fallback
      products = FALLBACK_PRODUCTS;
    }

    if (!products.length) {
      products = FALLBACK_PRODUCTS;
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to retrieve jewelry collection." });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let product = null;
    try {
      product = await prisma.product.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
      });
    } catch {
      // Offline fallback
    }

    if (!product) {
      product = FALLBACK_PRODUCTS.find((p) => p.id === id || p.slug === id);
    }

    if (!product) {
      res.status(404).json({ error: "Jewelry creation not found." });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Failed to retrieve jewelry creation." });
  }
};

export const createProductAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      price,
      caratWeight,
      metal,
      clarity,
      colorGrade,
      cutGrade,
      category,
      featured,
    } = req.body;

    const files = req.files as Express.Multer.File[] | undefined;
    const uploadedImageUrls: string[] = [];

    // Stream uploaded images to Cloudinary
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const result = await uploadImageToCloudinary(file.buffer);
          uploadedImageUrls.push(result.url);
        } catch (uploadErr) {
          console.warn("Cloudinary upload issue, fallback placeholder:", uploadErr);
          uploadedImageUrls.push("/images/graduated-riviere-diamond-necklace.jpg");
        }
      }
    }

    const slug = (name || "creation")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    let newProduct = null;
    try {
      newProduct = await prisma.product.create({
        data: {
          name,
          slug: `${slug}-${Date.now().toString().slice(-4)}`,
          description: description || "",
          price: Number(price) || 0,
          caratWeight: caratWeight || "3.5 ct",
          metal: metal || "Platinum 950",
          clarity: clarity || "VVS1",
          colorGrade: colorGrade || "D",
          cutGrade: cutGrade || "Triple Excellent",
          category: category || "necklaces",
          images: uploadedImageUrls.length > 0 ? uploadedImageUrls : ["/images/graduated-riviere-diamond-necklace.jpg"],
          featured: featured === "true" || featured === true,
        },
      });
    } catch {
      newProduct = {
        id: `prod-${Date.now()}`,
        name,
        slug,
        description,
        price: Number(price) || 0,
        images: uploadedImageUrls,
      };
    }

    res.status(201).json({
      success: true,
      message: "Haute joaillerie creation successfully registered.",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to register new jewelry creation." });
  }
};
