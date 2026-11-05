import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Gem, Sparkles } from "lucide-react";
import { JewelryItem, JewelryCategory, MetalType } from "@/types/jewelry";
import { JEWELRY_CATALOG } from "@/data/jewelryData";
import { ProductCard } from "@/components/shop/ProductCard";

interface ShopCatalogProps {
  onQuickView: (product: JewelryItem) => void;
  onInspect: (product: JewelryItem) => void;
}

export const ShopCatalog: React.FC<ShopCatalogProps> = ({
  onQuickView,
  onInspect,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<JewelryCategory>("all");
  const [selectedMetal, setSelectedMetal] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: { id: JewelryCategory; label: string }[] = [
    { id: "all", label: "All Creations" },
    { id: "necklaces", label: "Rivière & Necklaces" },
    { id: "rings", label: "Rings & Solitaires" },
    { id: "earrings", label: "Chandelier & Earrings" },
    { id: "bracelets", label: "Tennis Bracelets & Cuffs" },
  ];

  const filteredItems = useMemo(() => {
    return JEWELRY_CATALOG.filter((item) => {
      // Category match
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // Metal match
      if (
        selectedMetal !== "all" &&
        !item.availableMetals.some((m) => m.toLowerCase().includes(selectedMetal.toLowerCase()))
      ) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedCategory, selectedMetal, sortBy, searchQuery]);

  return (
    <section id="boutique" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-950/30 text-gold-400 text-xs uppercase tracking-[0.25em] mb-4">
          <Gem className="w-3.5 h-3.5" /> Haute Joaillerie Boutique
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif text-gold-100 leading-tight">
          Explore The Curated Salon
        </h2>
        <p className="mt-3 text-neutral-400 text-sm sm:text-base font-sans">
          Browse our collection as effortlessly as online fashion shopping. Filter by category, inspect 58-facet symmetry with the instant macro loupe, and reserve bespoke creations.
        </p>
      </div>

      {/* Filter and Search Bar Controls (Clothing Store Style) */}
      <div className="bg-neutral-950/80 border border-gold-500/20 rounded-2xl p-4 sm:p-6 mb-10 backdrop-blur-xl shadow-xl flex flex-col gap-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat.id
                  ? "bg-gold-500 text-black shadow-[0_0_15px_rgba(197,160,89,0.4)] font-semibold"
                  : "bg-neutral-900/80 text-neutral-400 hover:text-gold-200 hover:bg-neutral-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary Filters: Search, Metal & Sorting */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-neutral-900">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search diamonds, rivières, cuts, gemstones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-gold-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metal Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">
                Metal:
              </span>
              <select
                value={selectedMetal}
                onChange={(e) => setSelectedMetal(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-gold-400"
              >
                <option value="all">All Precious Metals</option>
                <option value="platinum">Platinum 950</option>
                <option value="yellow gold">18K Yellow Gold</option>
                <option value="white gold">18K White Gold</option>
                <option value="rose gold">18K Rose Gold</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-gold-400"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Counter readout */}
        <div className="flex items-center justify-between text-xs text-neutral-400 font-mono -mt-2">
          <span>
            Displaying <strong className="text-gold-300">{filteredItems.length}</strong> creations
          </span>
          <span className="text-[11px] text-neutral-500">
            Hover any item to trigger the instant Macro Loupe
          </span>
        </div>
      </div>

      {/* Product Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-neutral-900 bg-black/40">
          <Gem className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="font-serif text-xl text-neutral-300">No creations found matching your filter</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or reset filters to view our full Place Vendôme collection.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedMetal("all");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 rounded-xl border border-gold-500/40 text-gold-300 text-xs uppercase"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onInspect={onInspect}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ShopCatalog;
