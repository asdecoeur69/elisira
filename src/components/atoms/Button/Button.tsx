import { type ButtonHTMLAttributes, type AnchorHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-heading font-semibold tracking-[-0.01em] transition-all duration-200 ease-[cubic-bezier(0.22,0.61,0.36,1)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /* Aplat teal, ombre teintée, léger soulèvement au survol */
        primary:
          "bg-teal text-white shadow-[var(--shadow-2)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-3),0_8px_28px_var(--teal-glow)] active:translate-y-0 active:bg-teal-dark active:shadow-[var(--shadow-1)]",
        secondary:
          "border border-[var(--hairline-strong)] bg-white text-navy shadow-[var(--shadow-1)] hover:-translate-y-0.5 hover:border-teal hover:text-teal hover:shadow-[var(--shadow-2)] active:translate-y-0",
        /* Sur fond navy : le ciel porte le contraste */
        onNavy:
          "bg-white text-navy-deep shadow-[var(--shadow-2)] hover:-translate-y-0.5 hover:bg-sky hover:text-navy-deep active:translate-y-0",
        ghost:
          "text-cool-grey hover:bg-surface-sunken hover:text-navy active:bg-surface-edge",
      },
      size: {
        sm: "h-9 px-4 text-small",
        md: "h-11 px-6 text-body",
        lg: "h-14 px-8 text-body",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantProps & {
    href?: undefined;
  };

type ButtonAsAnchor = AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonVariantProps & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(({ className, variant, size, ...props }, ref) => {
  const classes = cn(buttonVariants({ variant, size, className }));

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorProps } = props as ButtonAsAnchor;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...anchorProps}
      />
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      {...(props as ButtonAsButton)}
    />
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
