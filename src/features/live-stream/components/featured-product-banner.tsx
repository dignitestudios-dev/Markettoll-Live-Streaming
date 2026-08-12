"use client";

import React from "react";
import { IoCartOutline, IoClose } from "react-icons/io5";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
}

interface FeaturedProductBannerProps {
  product: Product | null;
  onClose?: () => void;
  onBuyNow?: (product: Product) => void;
}

export default function FeaturedProductBanner({
  product,
  onClose,
  onBuyNow,
}: FeaturedProductBannerProps) {
  if (!product) return null;

  return (
    <div className="absolute top-4 right-4 z-30 max-w-[320px] bg-[#161D2A]/90 backdrop-blur-lg border border-white/20 rounded-2xl p-3 shadow-2xl animate-in slide-in-from-top-4 duration-300 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0098EA] bg-[#0098EA]/15 px-2 py-0.5 rounded-full">
          Featured Product
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IoClose className="text-base" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-14 h-14 object-cover rounded-xl border border-white/10 bg-black/40"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-white truncate">{product.name}</h4>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm font-bold text-emerald-400">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onBuyNow && onBuyNow(product)}
        className="w-full mt-2.5 py-1.5 bg-[#0098EA] hover:bg-[#0082c9] active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <IoCartOutline className="text-sm" /> Buy Now
      </button>
    </div>
  );
}
