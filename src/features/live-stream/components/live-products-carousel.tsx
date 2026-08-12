"use client";

import React from "react";
import { IoCartOutline, IoHeartOutline } from "react-icons/io5";

export interface LiveProductItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  image: string;
  soldCount?: string;
}

interface LiveProductsCarouselProps {
  products?: LiveProductItem[];
  onAddToCart?: (product: LiveProductItem) => void;
}

export default function LiveProductsCarousel({
  products = [],
  onAddToCart,
}: LiveProductsCarouselProps) {
  if (!products || products.length === 0) {
    return null;
  }
  console.log(products,"products")

  return (
    <div className="w-full bg-[#111723] p-4 border-t border-white/10 select-none">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[#0098EA] text-sm">🛒</span>
          <h3 className="text-white text-xs sm:text-sm font-bold tracking-tight">
            Live Products ({products.length})
          </h3>
        </div>
        <span className="text-[11px] text-gray-400 font-medium hover:text-white cursor-pointer transition-colors">
          Scroll for more &rarr;
        </span>
      </div>

      {/* Horizontal Scroll Product Cards */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="w-[165px] sm:w-[180px] shrink-0 bg-[#1A2232] border border-white/10 rounded-2xl p-2.5 text-white flex flex-col justify-between shadow-lg group hover:border-[#0098EA]/50 transition-all"
          >
            {/* Image Container */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/40 mb-2">
              <img
                src={prod.image}
                alt={prod.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Discount Tag */}
              {prod.discount && (
                <span className="absolute top-1.5 left-1.5 bg-[#FF3B30] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
                  {prod.discount}
                </span>
              )}
            </div>

            {/* Title & Price */}
            <div className="flex flex-col gap-1">
              <h4 className="text-xs font-semibold text-white truncate leading-tight">
                {prod.title}
              </h4>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-white">${prod.price.toFixed(2)}</span>
                {prod.originalPrice && (
                  <span className="text-[10px] text-gray-400 line-through">
                    ${prod.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {prod.soldCount && (
                <span className="text-[10px] text-gray-400 font-medium">
                  👁️ {prod.soldCount} Sold
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 mt-2.5">
              <button
                type="button"
                onClick={() => onAddToCart && onAddToCart(prod)}
                className="flex-1 py-1.5 bg-[#0098EA] hover:bg-[#0082c9] active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                <IoCartOutline className="text-sm" /> + Cart
              </button>
              <button
                type="button"
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
              >
                <IoHeartOutline className="text-xs" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
