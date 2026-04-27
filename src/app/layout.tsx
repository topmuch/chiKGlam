import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CHIC & GLAMOUR BY EVA | Maquillage Minéral & Végan | Lingerie Africaine",
  description:
    "Découvrez CHIC & GLAMOUR BY EVA — maquillage minéral, végan et hyper pigmenté. Lingerie africaine artisanale faite à la main au Sénégal. Livraison rapide en France.",
  keywords: [
    "maquillage minéral",
    "maquillage végan",
    "lingerie africaine",
    "Chic & Glamour by Eva",
    "beauté",
    "cosmétiques",
    "Senegal",
    "commerce équitable",
  ],
  authors: [{ name: "Chic & Glamour by Eva" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "CHIC & GLAMOUR BY EVA",
    description:
      "Maquillage minéral & végan | Lingerie africaine artisanale",
    url: "https://chicglambyeva.com",
    siteName: "Chic & Glamour by EVA",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "CHIC & GLAMOUR BY EVA",
    description: "Maquillage minéral & végan | Lingerie africaine artisanale",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
