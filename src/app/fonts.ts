import { Caveat, Fraunces, Hanken_Grotesk, Tiro_Devanagari_Hindi } from "next/font/google";

/** Display: warm, slightly odd old-press serif. SOFT/WONK axes are set in globals.css. */
export const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

/** Body/UI: Hanken Grotesk (SIL Open Font License). next/font self-hosts it at build time. */
export const hanken = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-hanken",
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

export const fontVariables = [fraunces.variable, hanken.variable, caveat.variable, tiro.variable].join(" ");
