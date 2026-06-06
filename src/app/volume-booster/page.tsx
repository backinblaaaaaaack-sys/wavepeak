import type { Metadata } from "next";
import Link from "next/link";
import VolumeBooster from "@/components/volume-booster/VolumeBooster";

export const metadata: Metadata = {
  title: "Volume Booster Online Free — Increase Audio Volume Up to 500% | Wavepeak",
  description: "Boost the volume of any audio file online for free — up to 500%. Works in your browser, no upload required. Supports MP3, WAV, FLAC, M4A, AAC, OGG, OPUS.",
  openGraph: {
    title: "Volume Booster Online Free — Increase Audio Volume Up to 500% | Wavepeak",
    description: "Boost audio volume up to 500% online for free. No upload, works in browser.",
    url: "https://wavepeak-iota.vercel.app/volume-booster",
    siteName: "Wavepeak",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Volume Booster Online Free | Wavepeak",
    description: "Increase audio volume up to 500% online. Free, no upload required.",
  },
};

export default function VolumeBoosterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-xl font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity">
            Wave<span className="text-muted-foreground">peak</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Volume Booster
          </h1>
          <p className="text-muted-foreground">
            Increase the volume of any audio file up to 500% — right in your browser. No upload, no server.
          </p>
        </div>
        <VolumeBooster />
      </main>

      <footer className="border-t border-border/50 px-6 py-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wavepeak. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
