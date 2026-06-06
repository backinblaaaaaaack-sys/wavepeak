import type { Metadata } from "next";
import Link from "next/link";
import Converter from "@/components/mp3-converter/Converter";

export const metadata: Metadata = {
  title: "MP3 Converter Online Free — Convert Any Audio to MP3 | Wavepeak",
  description: "Convert MP3, WAV, FLAC, M4A, AAC, OGG, OPUS to MP3 online for free. Choose quality up to 320 kbps. Works in your browser — no upload, no server.",
  openGraph: {
    title: "MP3 Converter Online Free — Convert Any Audio to MP3 | Wavepeak",
    description: "Convert any audio format to MP3 online. Choose quality up to 320 kbps. Free, fast, no upload required.",
    url: "https://wavepeak-iota.vercel.app/mp3-converter",
    siteName: "Wavepeak",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MP3 Converter Online Free | Wavepeak",
    description: "Convert any audio format to MP3 online for free. Up to 320 kbps, works in browser.",
  },
};

export default function Mp3ConverterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity">
            Wave<span className="text-muted-foreground">peak</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            MP3 Converter
          </h1>
          <p className="text-muted-foreground">
            Convert any audio file to MP3 — right in your browser. No upload, no server.
          </p>
        </div>

        <Converter />
      </main>

      <footer className="border-t border-border/50 px-6 py-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wavepeak. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
