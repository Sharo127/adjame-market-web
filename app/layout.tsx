import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnimatedBackground from "./components/AnimatedBackground";
import { PanierProvider } from "./contexts/PanierContext";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
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
      <body className={`${jakarta.variable} font-sans antialiased text-stone-100`}>
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
      </body>
    </html>
  );
}