import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    size: {
      lg: "text-lead",
      md: "text-body",
      sm: "text-small",
      xs: "text-fine",
    },
    color: {
      default: "text-navy",
      muted: "text-cool-grey",
      accent: "text-teal",
      /* Sur fond navy : le texte passe en blanc, le secondaire en gris clair */
      onNavy: "text-white",
      onNavyMuted: "text-cool-grey-light",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
});

type TextElement = "p" | "span";

export type TextProps = HTMLAttributes<HTMLParagraphElement> &
  VariantProps<typeof textVariants> & {
    as?: TextElement;
  };

function Text({ as, size, color, className, children, ...props }: TextProps) {
  const Component = as ?? "p";

  return (
    <Component
      className={cn(textVariants({ size, color, className }))}
      {...props}
    >
      {children}
    </Component>
  );
}

export { Text, textVariants };
