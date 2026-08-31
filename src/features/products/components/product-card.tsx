import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <CardContent className="flex flex-1 flex-col gap-2 pt-4">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          {product.category}
        </span>
        <h3 className="font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
          {product.title}
        </h3>
        <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
          {product.description}
        </p>
        {(product.quantity !== undefined || product.quantitySold !== undefined) && (
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {product.quantity !== undefined && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Stock: <span className="font-bold">{product.quantity}</span>
              </span>
            )}
            {product.quantitySold !== undefined && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-600 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-200/60 dark:border-zinc-700/60">
                Sold: <span className="font-bold">{product.quantitySold}</span>
              </span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
          ${product.price.toFixed(2)}
        </span>
        <span className="text-sm text-yellow-500">★ {product.rating.toFixed(1)}</span>
      </CardFooter>
    </Card>
  );
}
