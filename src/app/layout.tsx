import type { Metadata, Viewport } from "next";
import { InkFilters } from "@/components/ui/InkFilters";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pehla Din: Live the job before you choose it",
  description:
    "Live a realistic week in a career through interactive scenes, then get an honest Fit Report.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3ecdd",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh font-sans text-[17px] leading-normal antialiased">
        <InkFilters />
        {/* Pages set their own width. overflow-x-clip: tilted desk objects may poke past the gutter but must never cause sideways scroll. */}
        <main className="w-full overflow-x-clip px-4 pb-16 pt-6">{children}</main>
      </body>
    </html>
  );
}
