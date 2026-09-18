import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

function Skeleton({ className, variant = "text" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-iron-800",
        variant === "text" && "h-4 w-full rounded",
        variant === "circular" && "aspect-square rounded-full",
        variant === "rectangular" && "w-full rounded-lg",
        className
      )}
      aria-hidden="true"
    />
  );
}

export { Skeleton };
