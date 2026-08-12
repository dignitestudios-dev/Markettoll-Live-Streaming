import axiosInstance from "@/lib/axios";
import { SelectableProduct } from "../types/create-live-stream.types";

export interface SellerProductApiItem {
  _id: string;
  id?: string;
  name: string;
  price: number;
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

      return {
        id: item._id || item.id || Math.random().toString(),
        name: item.name || "Product",
        image: img,
        price: typeof item.price === "number" ? item.price : parseFloat(item.price as any) || 0,
        deliveryType: delivery,
        rating: ratingValue,
        category: item.category || "General",
      };
    });
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return [];
  }
}
