import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnimatedBackground from "./components/AnimatedBackground";
import { PanierProvider } from "./contexts/PanierContext";
import { Analytics } from "@vercel/analytics/next";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Adjamé Market",
  description: "La marketplace du marché d'Adjamé",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${manrope.variable} font-sans antialiased text-stone-100`}>
        {/* Halos lumineux */}
        <div className="blob-container" aria-hidden="true">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>

        {/* Grille lumineuse */}
        <div className="grid-overlay" aria-hidden="true" />

        {/* Animations globales : curseur, scroll, fade-in */}
        <AnimatedBackground />

        <PanierProvider>
          <Navbar />
          {children}
          <Footer />
        </PanierProvider>
        <Analytics />
      </body>
    </html>
  );
}