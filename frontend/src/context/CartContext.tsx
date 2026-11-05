import React, { createContext, useContext, useState, useEffect } from "react";
import { JewelryItem, CartItem, MetalType } from "@/types/jewelry";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: JewelryItem, metal?: MetalType) => void;
  removeFromCart: (productId: string, metal: MetalType) => void;
  updateQuantity: (productId: string, metal: MetalType, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  cartCount: number;
  cartTotal: number;
  lastAddedItem: JewelryItem | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("maison_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("maison_wishlist");
      return saved ? JSON.parse(saved) : ["riviere-diamond-necklace"];
    } catch {
      return ["riviere-diamond-necklace"];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<JewelryItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("maison_cart", JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("maison_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Could not save wishlist to localStorage", e);
    }
  }, [wishlist]);

  const addToCart = (product: JewelryItem, metal?: MetalType) => {
    const selectedMetal = metal || product.metal;
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selectedMetal === selectedMetal
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedMetal === selectedMetal
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedMetal }];
    });

    setLastAddedItem(product);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, metal: MetalType) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedMetal === metal)
      )
    );
  };

  const updateQuantity = (productId: string, metal: MetalType, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, metal);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedMetal === metal
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        cartCount,
        cartTotal,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
