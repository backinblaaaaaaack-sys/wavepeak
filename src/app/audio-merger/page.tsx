import type { Metadata } from "next";
import Link from "next/link";
import AudioMerger from "@/components/audio-merger/AudioMerger";

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak-iota.vercel.app/audio-merger' },
  title: "Audio Merger Online Free — Combine Multiple Audio Files | Wavepeak",
  description: "Merge and combine multiple audio files into one online for free. Supports MP3, WAV, FLAC, M4A, AAC, OGG, OPUS. Works in your browser — no upload, no server.",
  openGraph: {
    title: "Audio Merger Online Free — Combine Multiple Audio Files | Wavepeak",
    description: "Merge multiple audio files into one online for free. No upload required.",
    url: "https://wavepeak-iota.vercel.app/audio-merger",
    siteName: "Wavepeak",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Audio Merger Online Free | Wavepeak",
    description: "Combine multiple audio files into one. Free, works in browser.",
  },
};

export default function AudioMergerPage() {
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
            Audio Merger
          </h1>
          <p className="text-muted-foreground">
            Combine multiple audio files into one — right in your browser. Drag to reorder, then merge.
          </p>
        </div>
        <AudioMerger />
      </main>

      <footer className="border-t border-border/50 px-6 py-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wavepeak. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
