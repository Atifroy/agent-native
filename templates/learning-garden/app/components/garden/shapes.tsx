import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

export type ShapeId = "circle" | "square" | "triangle" | "star";
export type ColorId = "red" | "blue" | "yellow" | "green" | "purple";

export const SHAPE_IDS: ShapeId[] = ["circle", "square", "triangle", "star"];
export const COLOR_IDS: ColorId[] = [
  "red",
  "blue",
  "yellow",
  "green",
  "purple",
];

/** Maps a color id to its token — never a raw literal. */
export function colorToken(color: ColorId): string {
  return `hsl(var(--garden-${color}))`;
}

export function ShapeIcon({
  shape,
  color,
  className,
  ...props
}: { shape: ShapeId; color: ColorId } & SVGProps<SVGSVGElement>) {
  const fill = colorToken(color);
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-hidden="true"
      className={cn("drop-shadow-sm", className)}
      {...props}
    >
      {shape === "circle" && <circle cx="50" cy="50" r="34" fill={fill} />}
      {shape === "square" && (
        <rect x="18" y="18" width="64" height="64" rx="10" fill={fill} />
      )}
      {shape === "triangle" && (
        <path d="M50 14 L86 82 L14 82 Z" fill={fill} strokeLinejoin="round" />
      )}
      {shape === "star" && (
        <path
          d="M50 10 L61 38 L91 40 L67 59 L76 88 L50 71 L24 88 L33 59 L9 40 L39 38 Z"
          fill={fill}
        />
      )}
    </svg>
  );
}
