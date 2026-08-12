"use client";

import React, { useState, useMemo } from "react";
import ProductSelectCard from "./product-select-card";
import { IoSearchOutline } from "react-icons/io5";
import { useAuth } from "@/hooks/use-auth";
import { useSellerProductsQuery } from "../api/seller-products.queries";

interface ProductSelectorGridProps {
  selectedProductIds: string[];
  onChangeSelected: (ids: string[]) => void;
  error?: string;
}

export default function ProductSelectorGrid({
  selectedProductIds,
  onChangeSelected,
  error,
}: ProductSelectorGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const userId = (user as any)?._id || (user as any)?.id || "";

  // TanStack Query to fetch seller products dynamically from backend API
  const { data: apiProducts, isLoading } = useSellerProductsQuery(userId);

  // Directly use API products (or empty array if none)
  const displayProducts = useMemo(() => {
    return apiProducts || [];
  }, [apiProducts]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return displayProducts;
    const query = searchQuery.toLowerCase().trim();
    return displayProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
    );
  }, [displayProducts, searchQuery]);

  const handleToggleProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      onChangeSelected(selectedProductIds.filter((pId) => pId !== id));
    } else {
      if (selectedProductIds.length >= 20) {
        return; // Max 20 products
      }
      onChangeSelected([...selectedProductIds, id]);
    }
  };
  

  return (
    <div className="w-full flex flex-col gap-4 pt-4 border-t border-gray-100">
      {/* Section Header */}
    
        <div>
          <h3 className="text-[24px] sm:text-xl font-[700] text-[#003DAC] tracking-tight">
            Select Products
          </h3>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full my-5 h-[42px] pl-4 pr-10 rounded-full border border-gray-200 text-[16px] text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#003DAC] transition-all bg-white"
          />
          <IoSearchOutline className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
        </div>
      
      {/* Selected Products Counter Badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#0098EA]">
          {selectedProductIds?.length > 0
            ? `${selectedProductIds?.length}/20 Products Selected`
            : "0 Products Selected (Optional)"}
        </span>

        {selectedProductIds?.length > 0 && (
          <button
            type="button"
            onClick={() => onChangeSelected([])}
            className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            Clear selection
          </button>
        )}
      </div>

      {/* Loading Skeleton State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-56 rounded-2xl bg-gray-200/60 animate-pulse border border-gray-100"
            />
          ))}
        </div>
      ) : filteredProducts?.length > 0 ? (
        /* Product Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts?.map((product) => (
            <ProductSelectCard
              key={product?.id}
              product={product}
              isSelected={selectedProductIds?.includes(product?.id)}
              onToggle={handleToggleProduct}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="w-full min-h-[140px] flex items-center justify-center bg-white rounded-2xl border border-dashed border-gray-200 py-8">
          <h2 className="font-bold blue-text text-base sm:text-lg px-2">
            No Products Found
          </h2>
        </div>
      )}

      {error && (
        <span className="text-xs font-medium text-red-500 mt-1">
          {error}
        </span>
      )}
    </div>
  );
}
