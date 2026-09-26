import type { SVGProps } from "react";

/**
 * Simple, calm, rounded farm-animal illustrations. Flat shapes only — no
 * texture/noise/gradients that read as "busy" on a screen a child stares at
 * for a while. Each icon fills with a token color (never a raw hex) so light
 * and dark mode both stay legible; see the `--garden-*` tokens in global.css.
 */

function Base({
  children,
  ...props
}: SVGProps<SVGSVGElement> & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" role="img" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function CowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <ellipse cx="50" cy="60" rx="34" ry="26" fill="hsl(var(--garden-cow))" />
      <circle cx="30" cy="42" r="7" fill="hsl(var(--foreground) / 0.75)" />
      <circle cx="66" cy="46" r="10" fill="hsl(var(--foreground) / 0.75)" />
      <circle cx="50" cy="60" r="8" fill="hsl(var(--foreground) / 0.75)" />
      <ellipse cx="34" cy="30" rx="9" ry="6" fill="hsl(var(--garden-cow))" />
      <ellipse cx="66" cy="30" rx="9" ry="6" fill="hsl(var(--garden-cow))" />
      <ellipse
        cx="50"
        cy="80"
        rx="16"
        ry="8"
        fill="hsl(var(--garden-cow) / 0.6)"
      />
    </Base>
  );
}

export function DuckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <ellipse cx="52" cy="62" rx="30" ry="24" fill="hsl(var(--garden-duck))" />
      <circle cx="34" cy="36" r="16" fill="hsl(var(--garden-duck))" />
      <path
        d="M18 38 q-10 2 -10 8 q6 2 14 -2 z"
        fill="hsl(var(--garden-horse))"
      />
      <circle cx="30" cy="33" r="2.5" fill="hsl(var(--foreground) / 0.8)" />
    </Base>
  );
}

export function SheepIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <circle cx="34" cy="46" r="14" fill="hsl(var(--garden-sheep))" />
      <circle cx="50" cy="40" r="16" fill="hsl(var(--garden-sheep))" />
      <circle cx="66" cy="48" r="13" fill="hsl(var(--garden-sheep))" />
      <circle cx="48" cy="60" r="16" fill="hsl(var(--garden-sheep))" />
      <ellipse cx="28" cy="66" rx="10" ry="8" fill="hsl(var(--garden-horse))" />
      <circle cx="25" cy="63" r="2.2" fill="hsl(var(--foreground) / 0.8)" />
    </Base>
  );
}

export function PigIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <ellipse cx="50" cy="58" rx="32" ry="25" fill="hsl(var(--garden-pig))" />
      <ellipse cx="50" cy="30" rx="10" ry="6" fill="hsl(var(--garden-pig))" />
      <ellipse
        cx="50"
        cy="60"
        rx="12"
        ry="9"
        fill="hsl(var(--garden-pig) / 0.55)"
      />
      <circle cx="45" cy="58" r="2" fill="hsl(var(--foreground) / 0.7)" />
      <circle cx="55" cy="58" r="2" fill="hsl(var(--foreground) / 0.7)" />
      <circle cx="34" cy="46" r="2.2" fill="hsl(var(--foreground) / 0.8)" />
    </Base>
  );
}

export function HorseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Base {...props}>
      <ellipse
        cx="48"
        cy="62"
        rx="28"
        ry="22"
        fill="hsl(var(--garden-horse))"
      />
      <ellipse
        cx="70"
        cy="42"
        rx="14"
        ry="18"
        fill="hsl(var(--garden-horse))"
        transform="rotate(20 70 42)"
      />
      <ellipse cx="46" cy="26" rx="10" ry="12" fill="hsl(var(--garden-duck))" />
      <circle cx="74" cy="38" r="2.2" fill="hsl(var(--foreground) / 0.8)" />
    </Base>
  );
}

export interface AnimalDefinition {
  id: "cow" | "duck" | "sheep" | "pig" | "horse";
  letter: string;
  Icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
}

export const ANIMALS: AnimalDefinition[] = [
  { id: "cow", letter: "C", Icon: CowIcon },
  { id: "duck", letter: "D", Icon: DuckIcon },
  { id: "sheep", letter: "S", Icon: SheepIcon },
  { id: "pig", letter: "P", Icon: PigIcon },
  { id: "horse", letter: "H", Icon: HorseIcon },
];
