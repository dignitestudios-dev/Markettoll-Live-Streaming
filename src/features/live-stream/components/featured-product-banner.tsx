"use client";

import React from "react";
import { IoCartOutline, IoClose } from "react-icons/io5";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity?: number;
  quantitySold?: number;
  uploaderRole?: string;
  uploaderName?: string;
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

  const roleLower = product.uploaderRole?.toLowerCase().trim() || "";
  const isHostProduct = roleLower === "host";
  const isCohostProduct =
    roleLower === "co-host" ||
    roleLower === "cohost" ||
    roleLower === "co_host";

  return (
    <div className="absolute top-4 right-4 z-30 max-w-[320px] bg-[#161D2A]/90 backdrop-blur-lg border border-white/20 rounded-2xl p-3 shadow-2xl animate-in slide-in-from-top-4 duration-300 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0098EA] bg-[#0098EA]/15 px-2 py-0.5 rounded-full">
            Featured Product
          </span>
          {product.uploaderRole && (
            <span
              className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isHostProduct
                  ? "bg-[#0098EA]/20 text-[#0098EA] border border-[#0098EA]/30"
                  : isCohostProduct
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
              }`}
            >
              {isHostProduct
                ? "👑 Host"
                : isCohostProduct
                ? "🤝 Co-Host"
                : product.uploaderRole}
            </span>
          )}
        </div>
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
          {product.uploaderName && (
            <p className="text-[10px] text-gray-400 truncate">
              by <span className="text-gray-300 font-medium">{product.uploaderName}</span>
            </p>
          )}
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-sm font-bold text-emerald-400">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-[10px] text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {(product.quantity !== undefined || product.quantitySold !== undefined) && (
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {product.quantity !== undefined && (
                <span className="inline-flex items-center gap-1 text-[9px] font-medium text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  Stock: <span className="font-bold text-emerald-300">{product.quantity}</span>
                </span>
              )}
              {product.quantitySold !== undefined && (
                <span className="inline-flex items-center gap-1 text-[9px] font-medium text-slate-300 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                  Sold: <span className="font-bold text-white">{product.quantitySold}</span>
                </span>
              )}
            </div>
          )}
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
