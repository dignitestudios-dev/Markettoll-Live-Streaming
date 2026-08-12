import { cn } from "@/utils/cn";
import { LabelHTMLAttributes } from "react";

function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none text-zinc-700 dark:text-zinc-300",
        className
      )}
      {...props}
    />
  );
}

export { Label };


