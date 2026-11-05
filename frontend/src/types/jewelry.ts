export type MetalType = "18K Yellow Gold" | "18K White Gold" | "18K Rose Gold" | "Platinum 950";

export type JewelryCategory =
  | "all"
  | "necklaces"
  | "rings"
  | "earrings"
  | "bracelets"
  | "bespoke";

export interface JewelryItem {
  id: string;
  name: string;
  category: JewelryCategory;
  collection: string;
  price: number;
  originalPrice?: number;
  caratWeight: string;
  metal: MetalType;
  availableMetals: MetalType[];
  clarity: string;
  colorGrade: string;
  cutGrade: string;
  image: string;
  alt: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
  rating: number;
  reviewsCount: number;
  tags: string[];
}

export interface CartItem {
  product: JewelryItem;
  quantity: number;
  selectedMetal: MetalType;
}
