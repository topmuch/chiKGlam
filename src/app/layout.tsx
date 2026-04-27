import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "ChicGlambyEva | Premium Beauty & Skincare",
    template: "%s | ChicGlambyEva",
  },
  description:
    "Discover luxury beauty products, skincare essentials, and premium cosmetics at ChicGlambyEva. Shop top brands like La Mer, Charlotte Tilbury, Olaplex, Drunk Elephant, Fenty Beauty, and Tom Ford.",
  keywords: [
    "beauty",
    "skincare",
    "cosmetics",
    "makeup",
    "haircare",
    "fragrance",
    "luxury beauty",
    "premium skincare",
    "ChicGlambyEva",
    "La Mer",
    "Charlotte Tilbury",
    "Olaplex",
    "Drunk Elephant",
    "Fenty Beauty",
  ],
  authors: [{ name: "ChicGlambyEva" }],
  creator: "ChicGlambyEva",
  publisher: "ChicGlambyEva",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://chicglambyeva.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chicglambyeva.com",
    title: "ChicGlambyEva | Premium Beauty & Skincare",
    description:
      "Discover luxury beauty products and premium cosmetics. Free delivery on orders over €50.",
    siteName: "ChicGlambyEva",
    images: [
      {
        url: "/images/hero/hero-1.png",
        width: 1024,
        height: 1024,
        alt: "ChicGlambyEva Beauty Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChicGlambyEva | Premium Beauty & Skincare",
    description: "Discover luxury beauty products and premium cosmetics.",
    images: ["/images/hero/hero-1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
