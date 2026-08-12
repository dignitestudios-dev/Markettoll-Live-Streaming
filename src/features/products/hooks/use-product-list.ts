import { useState } from "react";
import { useProductsQuery } from "@/features/products/api/products.queries";

/**
 * Encapsulates products list state:
 * - data fetching via TanStack Query
 * - configurable limit with setter
 *
 * Usage: const { products, isLoading, limit, setLimit } = useProductList();
 */
export function useProductList(defaultLimit = 6) {
  const [limit, setLimit] = useState(defaultLimit);
  const { data, isLoading, isError, refetch } = useProductsQuery(limit);

  return {
    products: data?.products ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    limit,
    setLimit,
    refetch,
  };
}
