import axiosInstance from "@/lib/axios";
import { SelectableProduct } from "../types/create-live-stream.types";

export interface SellerProductApiItem {
  _id: string;
  id?: string;
  name: string;
  price?: number;
  pricing?: {
    originalPrice?: number;
    discountedPrice?: number;
    discountAmount?: number;
    discount?: {
      id?: string;
      type?: string;
      value?: number;
      startDate?: string;
      endDate?: string;
      status?: string;
    };
  };
  discount?: any;
  originalPrice?: number;
  discountedPrice?: number;
  fulfillmentMethod?: {
    selfPickup?: boolean;
    delivery?: boolean;
  };
  displayImage?: {
    url: string;
  };
  images?: Array<{ url: string } | string>;
  avgRating?: number;
  rating?: number;
  boostPlan?: {
    name: string;
  };
  isWishListed?: boolean;
  category?: string;
  quantity?: number;
  quantitySold?: number;
  stock?: number;
  soldCount?: number;
}

export function calculateAverageRating(avgRating?: any, fallbackRating?: any): number {
  if (typeof fallbackRating === "number" && !isNaN(fallbackRating) && fallbackRating > 0) {
    return fallbackRating;
  }
  if (typeof avgRating === "number" && !isNaN(avgRating)) {
    return avgRating;
  }
  if (avgRating && typeof avgRating === "object") {
    const one = avgRating.oneStar || 0;
    const two = avgRating.twoStar || 0;
    const three = avgRating.threeStar || 0;
    const four = avgRating.fourStar || 0;
    const five = avgRating.fiveStar || 0;

    const totalCount = one + two + three + four + five;
    const totalScore = one * 1 + two * 2 + three * 3 + four * 4 + five * 5;

    if (totalCount > 0) {
      return totalScore / totalCount;
    }
  }
  return 0;
}

export async function fetchSellerProducts(userId: string, page = 1): Promise<SelectableProduct[]> {
  if (!userId) return [];
  try {
    const response = await axiosInstance.get(`/users/seller-products/${userId}?page=${page}`);
    const rawList: SellerProductApiItem[] =
      response.data?.data || response.data?.products || response.data || [];

    if (!Array.isArray(rawList)) return [];

    return rawList.map((item) => {
      const img =
        item.displayImage?.url ||
        (typeof item.images?.[0] === "string" ? item.images[0] : item.images?.[0]?.url) ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop";

      const delivery = item.fulfillmentMethod?.selfPickup ? "Pickup" : "Delivery";
      const ratingValue = calculateAverageRating(item.avgRating, item.rating);

      const pricing = item.pricing;
      const discountObj = pricing?.discount || item.discount;

      // Extract effective / selling price
      let effectivePrice: number = 0;
      if (pricing?.discountedPrice !== undefined && pricing?.discountedPrice !== null) {
        effectivePrice = typeof pricing.discountedPrice === "number" ? pricing.discountedPrice : parseFloat(pricing.discountedPrice as any) || 0;
      } else if (item.discountedPrice !== undefined && item.discountedPrice !== null) {
        effectivePrice = typeof item.discountedPrice === "number" ? item.discountedPrice : parseFloat(item.discountedPrice as any) || 0;
      } else if (item.price !== undefined && item.price !== null) {
        effectivePrice = typeof item.price === "number" ? item.price : parseFloat(item.price as any) || 0;
      }

      // Extract original price
      let origPrice: number | undefined = undefined;
      if (pricing?.originalPrice !== undefined && pricing?.originalPrice !== null) {
        origPrice = typeof pricing.originalPrice === "number" ? pricing.originalPrice : parseFloat(pricing.originalPrice as any) || undefined;
      } else if (item.originalPrice !== undefined && item.originalPrice !== null) {
        origPrice = typeof item.originalPrice === "number" ? item.originalPrice : parseFloat(item.originalPrice as any) || undefined;
      }

      // Format discount badge
      let discountBadge: string | undefined = undefined;
      if (discountObj && discountObj.status !== "INACTIVE") {
        if (discountObj.type === "PERCENTAGE" && discountObj.value !== undefined) {
          discountBadge = `${discountObj.value}% Discount`;
        } else if (discountObj.type === "FIXED_AMOUNT" && discountObj.value !== undefined) {
          discountBadge = `$${discountObj.value} Discount`;
        }
      }

      if (!discountBadge && pricing?.discountAmount !== undefined && pricing.discountAmount > 0) {
        discountBadge = `$${pricing.discountAmount} Discount`;
      }

      if (!discountBadge && origPrice && origPrice > effectivePrice) {
        const pct = Math.round(((origPrice - effectivePrice) / origPrice) * 100);
        if (pct > 0) {
          discountBadge = `${pct}% Discount`;
        }
      }

      // Quantity (Stock) and Quantity Sold
      const rawQuantity =
        typeof item.quantity === "number"
          ? item.quantity
          : typeof item.stock === "number"
          ? item.stock
          : item.quantity !== undefined && !isNaN(Number(item.quantity))
          ? Number(item.quantity)
          : item.stock !== undefined && !isNaN(Number(item.stock))
          ? Number(item.stock)
          : undefined;

      const rawQuantitySold =
        typeof item.quantitySold === "number"
          ? item.quantitySold
          : typeof item.soldCount === "number"
          ? item.soldCount
          : item.quantitySold !== undefined && !isNaN(Number(item.quantitySold))
          ? Number(item.quantitySold)
          : item.soldCount !== undefined && !isNaN(Number(item.soldCount))
          ? Number(item.soldCount)
          : undefined;

      return {
        id: item._id || item.id || Math.random().toString(),
        name: item.name || "Product",
        image: img,
        price: effectivePrice,
        originalPrice: origPrice,
        discount: discountBadge,
        pricing: item.pricing,
        deliveryType: delivery,
        rating: ratingValue,
        category: item.category || "General",
        quantity: rawQuantity,
        quantitySold: rawQuantitySold,
      };
    });
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return [];
  }
}
