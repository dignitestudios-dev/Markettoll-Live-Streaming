import React from "react";
import { SelectableProduct } from "../types/create-live-stream.types";
import { calculateAverageRating } from "../api/seller-products.service";
import { FaStar } from "react-icons/fa";

interface ProductSelectCardProps {
  product: SelectableProduct;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export default function ProductSelectCard({
  product,
  isSelected,
  onToggle,
}: ProductSelectCardProps) {
  const numericRating =
    typeof product?.rating === "number" && !isNaN(product.rating)
      ? product.rating
      : calculateAverageRating((product as any)?.avgRating, product?.rating);

  const formattedRating = numericRating > 0 ? numericRating.toFixed(1) : "0.0";

  return (
    <div
      onClick={() => onToggle(product.id)}
      className={`group relative flex flex-col p-2.5 rounded-2xl bg-white border transition-all cursor-pointer select-none ${
        isSelected
          ? "border-[#0098EA] ring-2 ring-[#0098EA]/30 shadow-md"
          : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
      }`}
    >
      {/* Selection indicator circle on top right */}
      <div className="absolute top-4 right-4 z-10">
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
            isSelected
              ? "bg-[#0098EA] border-[#0098EA]"
              : "bg-white/80 backdrop-blur-xs border-gray-300 group-hover:border-gray-400"
          }`}
        >
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>

      {/* Product Image */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2.5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-2 left-2 z-10 bg-[#FF3B30] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
            {product.discount}
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-0.5 px-1">
        <h4 className="text-[16.16px] font-[500] text-[#333333] line-clamp-1 group-hover:text-[#003DAC] transition-colors">
          {product.name}
        </h4>

        <span className="text-[12.57px] font-[400] text-[#9D9D9DDD]">
          {product.deliveryType}
        </span>

        {/* Rating and Price Row */}
        <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-50">
          <div className="flex items-center gap-1 text-xs">
            <FaStar className="text-amber-400 text-xs" />
            <span className="font-medium text-gray-700 text-[11px]">
              {formattedRating}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-[16.16px] font-[600] text-[#003DAC]">
              ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
            </span>
            {product.originalPrice !== undefined && product.originalPrice > product.price && (
              <span className="text-[11px] font-[400] text-gray-400 line-through">
                ${typeof product.originalPrice === "number" ? product.originalPrice.toFixed(2) : product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
