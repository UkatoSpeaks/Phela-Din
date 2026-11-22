import { Caveat, Fraunces, Tiro_Devanagari_Hindi } from "next/font/google";
import localFont from "next/font/local";

/** Display: warm, slightly odd old-press serif. SOFT/WONK axes are set in globals.css. */
export const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

/**
 * Body/UI: Satoshi (Indian Type Foundry, ITF Free Font License).
 * Self-hosted, unmodified files as the licence requires (no subsetting or conversion).
 * If this repo ever becomes public, switch to the Fontshare API (see docs/design.md §2).
 */
export const satoshi = localFont({
  src: [
    { path: "./fonts/satoshi/Satoshi-Variable.woff2", weight: "300 900", style: "normal" },
    { path: "./fonts/satoshi/Satoshi-VariableItalic.woff2", weight: "300 900", style: "italic" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

/** Handwriting: sticky notes, margin annotations, signatures. */
export const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap" });

/** Short bilingual Hindi labels. Always paired with English. */
export const tiro = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: "400",
  variable: "--font-tiro",
  display: "swap",
});

export const fontVariables = [fraunces.variable, satoshi.variable, caveat.variable, tiro.variable].join(" ");
