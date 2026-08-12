import { useQuery } from "@tanstack/react-query";
import { fetchProductCategories, ProductCategory } from "./product-categories.service";

export const categoryKeys = {
  all: ["product-categories"] as const,
};

export function useProductCategoriesQuery() {
  return useQuery<ProductCategory[]>({
    queryKey: categoryKeys.all,
    queryFn: () => fetchProductCategories(),
    staleTime: 1000 * 60 * 15,
  });
}
