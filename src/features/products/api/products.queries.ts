import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/products/api/products.service";

export const productKeys = {
  all: ["products"] as const,
  list: (limit: number) => [...productKeys.all, "list", limit] as const,
};

export function useProductsQuery(limit = 6) {
  return useQuery({
    queryKey: productKeys.list(limit),
    queryFn: () => getProducts(limit),
  });
}
