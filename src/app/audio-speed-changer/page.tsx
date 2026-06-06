import type { Metadata } from "next";
import Link from "next/link";
import AudioSpeedChanger from "@/components/audio-speed-changer/AudioSpeedChanger";

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak-iota.vercel.app/audio-speed-changer' },
  title: "Audio Speed Changer Online Free — Speed Up or Slow Down Any Audio | Wavepeak",
  description: "Change the speed of any audio file online for free. Speed up or slow down without changing the pitch. Supports MP3, WAV, FLAC, M4A, AAC, OGG, OPUS. Works in your browser.",
  openGraph: {
    title: "Audio Speed Changer Online Free — Speed Up or Slow Down Any Audio | Wavepeak",
    description: "Speed up or slow down any audio file online for free. No pitch change, no upload required.",
    url: "https://wavepeak-iota.vercel.app/audio-speed-changer",
    siteName: "Wavepeak",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Audio Speed Changer Online Free | Wavepeak",
    description: "Speed up or slow down any audio. Free, works in browser, no upload.",
  },
};

export default function AudioSpeedChangerPage() {
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
            Audio Speed Changer
          </h1>
          <p className="text-muted-foreground">
            Speed up or slow down any audio file without changing the pitch — right in your browser.
          </p>
        </div>
        <AudioSpeedChanger />
      </main>

      <footer className="border-t border-border/50 px-6 py-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wavepeak. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
