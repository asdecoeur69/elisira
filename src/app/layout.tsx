import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { LocalCartProvider } from "@/lib/cart/LocalCartProvider";
import { MotionProvider } from "@/providers/MotionProvider";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { AgeGate } from "@/components/organisms/AgeGate";
import { CartDrawer } from "@/components/organisms/CartDrawer";
import "./globals.css";

/* Serif éditorial — fait écho à l'anglaise « Elisira » de l'étiquette */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

/* Sans géométrique discrète — lisible, jamais tech */
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elisira — Liqueur de mandarines siciliennes | H&H Spirits",
  description:
    "Recette de famille aux mandarines biologiques de Sicile, élaborée à Genève. 28 % vol. En digestif, en cocktail ou sur un dessert.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocalCartProvider>
          <MotionProvider>
            <AgeGate />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </MotionProvider>
        </LocalCartProvider>
      </body>
    </html>
  );
}
