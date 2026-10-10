import type { Metadata } from "next";
import Link from "next/link";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Lab — Vibe codeur vs Dev augmenté",
  description: "Démo live de la Masterclass Dev + Agents IA, GTECH Sénégal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <header className="topbar">
          <Link href="/" className="brand">GTECH Lab</Link>
          <nav>
            <Link href="/lab1">Filtre</Link>
            <Link href="/lab2">Débogage</Link>
            <Link href="/lab3">Performance</Link>
            <Link href="/lab4">Sécurité</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
