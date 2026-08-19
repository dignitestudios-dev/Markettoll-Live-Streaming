"use client";

import { fetchLiveStreamsAPI } from "@/features/home/api/lives.service";
import queryClient from "@/lib/query-client";
import React, { useState } from "react";
import {
  IoCartOutline,
  IoHeartOutline,
  IoStarSharp,
  IoPeopleSharp,
  IoRefreshOutline,
} from "react-icons/io5";

export interface LiveProductItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  image: string;
  soldCount?: string;
  uploaderRole?: string;
  uploaderName?: string;
}

interface LiveProductsCarouselProps {
  products?: LiveProductItem[];
  onAddToCart?: (product: LiveProductItem) => void;
  onRefresh?: () => void | Promise<void>;
  showAddToCart?: boolean;
}

export default function LiveProductsCarousel({
  products = [],
  onAddToCart,
  onRefresh,
  showAddToCart = true,
}: LiveProductsCarouselProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!products || products.length === 0) {
    return null;
  }

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        await queryClient.invalidateQueries({ queryKey: ["lives"] });
      }
    } catch (error) {
      console.error("Failed to refresh live products:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

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

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-gray-400 font-medium hover:text-white cursor-pointer transition-colors">
            Scroll for more &rarr;
          </span>

          {/* Refresh Button */}
         {/* Refresh Button */}
<button
  type="button"
  onClick={handleRefresh}
  disabled={isRefreshing}
  aria-label="Refresh products"
  className="
    group/refresh
    flex items-center justify-center
    w-9 h-9
    rounded-full
    bg-[#0098EA]/15
    border border-[#0098EA]/30
    text-[#0098EA]
    shadow-lg shadow-[#0098EA]/10
    hover:bg-[#0098EA]
    hover:border-[#0098EA]
    hover:text-white
    active:scale-90
    transition-all duration-200
    cursor-pointer
    disabled:opacity-70
    disabled:cursor-not-allowed
  "
>
  <IoRefreshOutline
    className={`text-xl ${
      isRefreshing ? "animate-spin" : ""
    }`}
  />
</button>
        </div>
      </div>

      {/* Horizontal Scroll Product Cards */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
        {products.map((prod) => {
          const roleLower = prod.uploaderRole?.toLowerCase().trim() || "";
          const isHostProduct = roleLower === "host";
          const isCohostProduct =
            roleLower === "co-host" ||
            roleLower === "cohost" ||
            roleLower === "co_host";

          const roleLabel = isHostProduct
            ? "Host"
            : isCohostProduct
            ? "Co-Host"
            : prod.uploaderRole;

          const RoleIcon = isHostProduct
            ? IoStarSharp
            : isCohostProduct
            ? IoPeopleSharp
            : null;

          // Single source of truth for role styling — used once on the image,
          // so we don't repeat the same badge twice on one card.
          const roleBadgeClasses = isHostProduct
            ? "bg-gradient-to-r from-[#0098EA] to-[#00B4FF] text-white"
            : isCohostProduct
            ? "bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white"
            : "bg-slate-700/90 text-slate-100";

          return (
            <div
              key={prod.id}
              className="w-[170px] sm:w-[190px] shrink-0 bg-[#1A2232] border border-white/10 rounded-2xl p-2.5 text-white flex flex-col justify-between shadow-lg group hover:border-[#0098EA]/50 transition-all"
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

                {/* Uploader Role Badge — single, clean pill, top-right */}
                {roleLabel && (
                  <span
                    className={`absolute top-1.5 right-1.5 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full shadow-md ring-1 ring-white/20 ${roleBadgeClasses}`}
                  >
                    {RoleIcon && <RoleIcon className="text-[10px]" />}
                    {roleLabel}
                  </span>
                )}

                {/* Subtle bottom gradient so the badge/discount never fight the image */}
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>

              {/* Title & Price & Uploader info */}
              <div className="flex flex-col gap-1">
                {prod.uploaderName && (
                  <span
                    className="text-[10px] text-gray-400 font-medium truncate"
                    title={prod.uploaderName}
                  >
                    by <span className="text-gray-300">{prod.uploaderName}</span>
                  </span>
                )}

                <h4 className="text-xs font-semibold text-white truncate leading-tight">
                  {prod.title}
                </h4>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-white">
                    ${typeof prod.price === "number" ? prod.price.toFixed(2) : prod.price}
                  </span>
                  {prod.originalPrice && (
                    <span className="text-[10px] text-gray-400 line-through">
                      ${typeof prod.originalPrice === "number" ? prod.originalPrice.toFixed(2) : prod.originalPrice}
                    </span>
                  )}
                </div>
                {/* {prod.soldCount && (
                  <span className="text-[10px] text-gray-400 font-medium">
                    👁️ {prod.soldCount} Sold
                  </span>
                )} */}
              </div>

              {/* Action Buttons (Viewer Only) */}
              {showAddToCart && (
                <div className="flex items-center gap-1.5 mt-2.5">
                  <button
                    type="button"
                    onClick={() => onAddToCart && onAddToCart(prod)}
                    className="flex-1 py-1.5 bg-[#0098EA] hover:bg-[#0082c9] active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <IoCartOutline className="text-sm" /> + Cart
                  </button>
                  {/* <button
                    type="button"
                    className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
                  >
                    <IoHeartOutline className="text-xs" />
                  </button> */}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}