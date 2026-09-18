import { cn } from "@/lib/utils";

const icons = {
  "arrow-right": {
    viewBox: "0 0 24 24",
    path: "M5 12h14m-7-7 7 7-7 7",
    fill: "none",
    strokeWidth: 2,
  },
  "chevron-down": {
    viewBox: "0 0 24 24",
    path: "m6 9 6 6 6-6",
    fill: "none",
    strokeWidth: 2,
  },
  "chevron-right": {
    viewBox: "0 0 24 24",
    path: "m9 18 6-6-6-6",
    fill: "none",
    strokeWidth: 2,
  },
  close: {
    viewBox: "0 0 24 24",
    path: "M18 6 6 18M6 6l12 12",
    fill: "none",
    strokeWidth: 2,
  },
  menu: {
    viewBox: "0 0 24 24",
    path: "M4 6h16M4 12h16M4 18h16",
    fill: "none",
    strokeWidth: 2,
  },
  cart: {
    viewBox: "0 0 24 24",
    path: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4ZM3 6h18M16 10a4 4 0 0 1-8 0",
    fill: "none",
    strokeWidth: 2,
  },
  search: {
    viewBox: "0 0 24 24",
    path: "M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm10 18-4.35-4.35",
    fill: "none",
    strokeWidth: 2,
  },
  shield: {
    viewBox: "0 0 24 24",
    path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z",
    fill: "none",
    strokeWidth: 2,
  },
  truck: {
    viewBox: "0 0 24 24",
    path: "M1 3h15v13H1ZM16 8h4l3 4v5h-7V8ZM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
    fill: "none",
    strokeWidth: 2,
  },
  refresh: {
    viewBox: "0 0 24 24",
    path: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15",
    fill: "none",
    strokeWidth: 2,
  },
  star: {
    viewBox: "0 0 24 24",
    path: "m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z",
    fill: "none",
    strokeWidth: 2,
  },
  check: {
    viewBox: "0 0 24 24",
    path: "M20 6 9 17l-5-5",
    fill: "none",
    strokeWidth: 2,
  },
  minus: {
    viewBox: "0 0 24 24",
    path: "M5 12h14",
    fill: "none",
    strokeWidth: 2,
  },
  plus: {
    viewBox: "0 0 24 24",
    path: "M12 5v14M5 12h14",
    fill: "none",
    strokeWidth: 2,
  },
  "grip-vertical": {
    viewBox: "0 0 24 24",
    path: "M9 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM9 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM15 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM15 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM15 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
    fill: "currentColor",
    strokeWidth: 0,
  },
} as const;

export type IconName = keyof typeof icons;

export interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

function Icon({ name, size = 24, className }: IconProps) {
  const icon = icons[name];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={icon.viewBox}
      fill={icon.fill === "currentColor" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={icon.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}

export { Icon };
