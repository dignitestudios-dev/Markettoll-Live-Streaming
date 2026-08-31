"use client";

import React, { useState, useMemo } from "react";
import { IoClose, IoSearchOutline, IoCheckmark } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/use-auth";
import { useSellerProductsQuery } from "@/features/create-live-stream/api/seller-products.queries";
import { calculateAverageRating } from "@/features/create-live-stream/api/seller-products.service";
import { liveSocketService } from "../services/live-socket.service";
import queryClient from "@/lib/query-client";

interface CohostProductSelectModalProps {
  isOpen: boolean;
  liveId: string;
  onClose: () => void;
  onSuccess?: (productIds: string[], products?: any[]) => void;
}

export default function CohostProductSelectModal({
  isOpen,
  liveId,
  onClose,
  onSuccess,
}: CohostProductSelectModalProps) {
  const { user } = useAuth();
  const userId = (user as any)?._id || (user as any)?.id || "";

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: apiProducts, isLoading } = useSellerProductsQuery(userId);

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

  if (!isOpen) return null;

  const handleToggleProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleSkip = () => {
    setSelectedProductIds([]);
    toast.info("Skipped adding products to live stream.");
    onClose();
  };

  const handleNext = async () => {
    if (selectedProductIds.length === 0) {
      // If nothing selected, simply close modal or proceed
      onClose();
      return;
    }

    try {
      setIsSubmitting(true);
    
      const res = await liveSocketService.addProducts(liveId, selectedProductIds);
      if (res?.success) {
        toast.success(res?.message || "Products added to live stream!");
        const selectedObjects = displayProducts.filter((p) =>
          selectedProductIds.includes(p.id)
        );
        const addedProducts =
          (Array.isArray(res?.data?.products) && res.data.products.length > 0
            ? res.data.products
            : null) ||
          (Array.isArray(res?.data) && res.data.length > 0 ? res.data : null) ||
          (Array.isArray((res as any)?.products) && (res as any).products.length > 0
            ? (res as any).products
            : null) ||
          selectedObjects;

        onSuccess?.(selectedProductIds, addedProducts);
        queryClient.invalidateQueries({ queryKey: ["lives"] });
        onClose();
      } else {
        toast.error(res?.message || "Failed to add products to live stream.");
      }
    } catch (error: any) {
      console.error("Failed to add products to live:", error);
      toast.error(error?.message || "Failed to add products to live stream.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-2xl bg-white rounded-[24px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
              Select Your Products
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Choose the products you want to feature during the live stream.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSkip}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <IoClose className="text-lg" />
          </button>
        </div>

        {/* Search & Selection count bar */}
        <div className="px-6 pt-4 pb-2 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-3.5 pr-9 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#0098EA] focus:ring-1 focus:ring-[#0098EA] transition-all"
            />
            <IoSearchOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs font-semibold text-[#0098EA]">
              {selectedProductIds.length > 0
                ? `${selectedProductIds.length} Selected`
                : "No products selected"}
            </span>
            {selectedProductIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedProductIds([])}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Products Grid Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-[220px]">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-48 rounded-2xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {filteredProducts.map((product) => {
                const isSelected = selectedProductIds.includes(product.id);
                const numericRating =
                  typeof product?.rating === "number" && !isNaN(product.rating)
                    ? product.rating
                    : calculateAverageRating(
                        (product as any)?.avgRating,
                        product?.rating
                      );
                const formattedRating =
                  numericRating > 0 ? numericRating.toFixed(1) : "0.0";

                return (
                  <div
                    key={product.id}
                    onClick={() => handleToggleProduct(product.id)}
                    className={`group relative flex flex-col p-2 rounded-2xl bg-white border transition-all cursor-pointer select-none ${
                      isSelected
                        ? "border-[#0098EA] ring-2 ring-[#0098EA]/30 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-xs"
                    }`}
                  >
                    {/* Selected Checkmark Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? "bg-[#0098EA] border-[#0098EA] text-white"
                            : "bg-white/90 border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        {isSelected && <IoCheckmark className="text-xs" />}
                      </div>
                    </div>

                    {/* Image */}
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 mb-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Discount Badge */}
                      {product.discount && (
                        <span className="absolute top-2 left-2 z-10 bg-[#FF3B30] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md">
                          {product.discount}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-0.5 px-1">
                      <h4 className="text-xs font-semibold text-gray-800 line-clamp-1 group-hover:text-[#0098EA] transition-colors">
                        {product.name}
                      </h4>
                      <span className="text-[10px] text-gray-400">
                        {product.deliveryType}
                      </span>

                      {/* Stock and Sold Badge Row */}
                      {(product.quantity !== undefined || product.quantitySold !== undefined) && (
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          {product.quantity !== undefined && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                              <span className="w-1 h-1 rounded-full bg-emerald-500" />
                              Stock: <span className="font-bold">{product.quantity}</span>
                            </span>
                          )}
                          {product.quantitySold !== undefined && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                              Sold: <span className="font-bold">{product.quantitySold}</span>
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-[10px] text-gray-600">
                          <FaStar className="text-amber-400 text-[10px]" />
                          <span>{formattedRating}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-bold text-[#0098EA]">
                            ${typeof product.price === "number" ? product.price.toFixed(2) : product.price}
                          </span>
                          {product.originalPrice !== undefined && product.originalPrice > product.price && (
                            <span className="text-[10px] text-gray-400 line-through">
                              ${typeof product.originalPrice === "number" ? product.originalPrice.toFixed(2) : product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-full h-48 flex flex-col items-center justify-center text-center">
              <span className="text-3xl mb-2">📦</span>
              <h4 className="text-sm font-bold text-gray-700">
                No Products Found
              </h4>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                {searchQuery
                  ? "No products matching your search term."
                  : "You haven't listed any products yet."}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions (Skip and Next) */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSkip}
            className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-semibold text-xs transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            Skip
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-[#0098EA] hover:bg-[#0082c9] text-white font-bold text-xs transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow-md cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Adding Products...
              </>
            ) : (
              <>Next</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
