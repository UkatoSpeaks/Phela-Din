import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";

/*
 * Buttons behave like physical keys: a hard lip underneath that presses flat
 * when tapped. No gradients, no glow.
 */
const base =
  "inline-flex min-h-12 select-none items-center justify-center gap-2 rounded-[var(--radius-control)] px-6 text-base font-bold tracking-[0.01em] transition-[transform,box-shadow,background-color] duration-100 disabled:pointer-events-none disabled:opacity-45";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-sheet shadow-[0_4px_0_0_var(--color-khaki-2)] hover:bg-[#2c261f] active:translate-y-[4px] active:shadow-[0_0_0_0_var(--color-khaki-2)]",
  secondary:
    "border-2 border-ink bg-sheet text-ink shadow-[0_4px_0_0_var(--color-ink)] active:translate-y-[4px] active:shadow-[0_0_0_0_var(--color-ink)]",
  ghost: "px-2 text-ink underline decoration-chai decoration-2 underline-offset-4 hover:decoration-ink",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button type="button" className={buttonClass(variant, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}
