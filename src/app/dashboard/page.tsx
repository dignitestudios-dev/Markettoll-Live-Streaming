"use client";

import { useProductList } from "@/features/products/hooks/use-product-list";
import ProductCard from "@/features/products/components/product-card";

export default function DashboardPage() {
  const { products, isLoading, isError } = useProductList(6);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Products fetched from DummyJSON API via TanStack Query
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          Failed to load products. Please try again.
        </div>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
