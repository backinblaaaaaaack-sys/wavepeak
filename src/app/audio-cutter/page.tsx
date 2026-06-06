import type { Metadata } from "next";
import Link from "next/link";
import AudioCutter from "@/components/audio-cutter/AudioCutter";

export const metadata: Metadata = {
  title: "Audio Cutter Online Free — Trim & Cut Any Audio File | Wavepeak",
  description: "Cut and trim any audio file online for free. Works in your browser — no upload, no server. Supports MP3, WAV, FLAC, M4A, AAC, OGG, OPUS.",
  openGraph: {
    title: "Audio Cutter Online Free — Trim & Cut Any Audio File | Wavepeak",
    description: "Cut and trim any audio file online for free. No upload required. Supports all major formats.",
    url: "https://wavepeak-iota.vercel.app/audio-cutter",
    siteName: "Wavepeak",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Audio Cutter Online Free | Wavepeak",
    description: "Trim and cut any audio file in your browser. Free, no upload.",
  },
};

export default function AudioCutterPage() {
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
            Audio Cutter
          </h1>
          <p className="text-muted-foreground">
            Trim and cut any audio file — right in your browser. No upload, no server.
          </p>
        </div>
        <AudioCutter />
      </main>

      <footer className="border-t border-border/50 px-6 py-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wavepeak. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
