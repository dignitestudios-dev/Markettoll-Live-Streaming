"use client";

import React from "react";
import { useProductCategoriesQuery } from "@/features/create-live-stream/api/product-categories.queries";

interface CategoryBarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryBar({
  activeCategory,
  onSelectCategory,
}: CategoryBarProps) {
  const { data: categoriesData } = useProductCategoriesQuery();
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  return (
    <div className="w-full py-2 my-1">
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* All Category Pill */}
        <button
          type="button"
          onClick={() => onSelectCategory("All")}
          className={`px-4 py-2 rounded-[13.875px] text-[13.875px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
            activeCategory === "All"
              ? "bg-[#0098EA] text-white shadow-xs font-medium"
              : "bg-[#F7F7F7] text-[#0F0F0F] hover:bg-gray-200"
          }`}
        >
          All
        </button>

        {/* Dynamic API Categories */}
        {categories.map((cat) => {
          const catName = cat.name || "";
          if (!catName) return null;
          const isActive = activeCategory === catName;
          return (
            <button
              key={cat._id || catName}
              type="button"
              onClick={() => onSelectCategory(catName)}
              className={`px-4 py-2 rounded-[13.875px] text-[13.875px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#0098EA] text-white shadow-xs font-medium"
                  : "bg-[#F7F7F7] text-[#0F0F0F] hover:bg-gray-200"
              }`}
            >
              {catName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
