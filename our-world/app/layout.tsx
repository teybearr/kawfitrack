import type { Metadata } from "next";
import { Playfair_Display, Caveat, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], display: "swap" });
const caveat = Caveat({ subsets: ["latin"], display: "swap" });
const dm = DM_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "our little world 🎀",
  description: "a little corner of the internet, just for us",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --font-playfair: ${playfair.style.fontFamily};
            --font-caveat: ${caveat.style.fontFamily};
            --font-dm: ${dm.style.fontFamily};
          }
        `}</style>
      </head>
      <body className="bg-velvet text-cream antialiased">
        {children}
      </body>
    </html>
  );
}