import { useQuery } from "@tanstack/react-query";
import { fetchSellerProducts } from "./seller-products.service";

export const sellerProductKeys = {
  all: ["seller-products"] as const,
  byUser: (userId: string, page: number) => [...sellerProductKeys.all, userId, page] as const,
};

export function useSellerProductsQuery(userId: string, page = 1) {
  return useQuery({
    queryKey: sellerProductKeys.byUser(userId, page),
    queryFn: () => fetchSellerProducts(userId, page),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}
