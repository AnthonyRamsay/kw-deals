import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "@/components/ui/toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "KW Deals | Best Deals in Kitchener-Waterloo",
    template: "%s | KW Deals",
  },
  description:
    "Discover the best deals, discounts, and new businesses in Kitchener-Waterloo. Updated weekly.",
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "KW Deals",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
