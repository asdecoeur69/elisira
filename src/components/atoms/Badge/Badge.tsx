import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-medium uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-iron-800 text-iron-200",
        accent: "bg-tactical-500/10 text-tactical-400",
        success: "bg-emerald-500/10 text-emerald-400",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px] rounded",
        md: "px-2.5 py-1 text-xs rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

function Badge({ variant, size, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
