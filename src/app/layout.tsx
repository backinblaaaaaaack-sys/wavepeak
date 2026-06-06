import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wavepeak-iota.vercel.app"),
  title: "Wavepeak — Free Online Audio Tools",
  description: "Convert, cut, merge and enhance audio files directly in your browser. No upload, no server. Free online audio tools.",
  openGraph: {
    title: "Wavepeak — Free Online Audio Tools",
    description: "Convert, cut, merge and enhance audio files directly in your browser. No upload, no server.",
    url: "https://wavepeak-iota.vercel.app",
    siteName: "Wavepeak",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wavepeak — Free Online Audio Tools",
    description: "Convert, cut, merge and enhance audio files directly in your browser.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
