import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const headingVariants = cva("font-heading font-semibold", {
  variants: {
    size: {
      display: "text-display",
      h1: "text-display",
      h2: "text-h2",
      h3: "text-h3",
      h4: "text-lead",
    },
  },
  defaultVariants: {
    size: "h2",
  },
});

type HeadingElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & {
    as?: HeadingElement;
  };

function Heading({ as, size, className, children, ...props }: HeadingProps) {
  const Component = as ?? "h2";

  return (
    <Component className={cn(headingVariants({ size, className }))} {...props}>
      {children}
    </Component>
  );
}

export { Heading, headingVariants };
