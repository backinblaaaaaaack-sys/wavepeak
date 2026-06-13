import type { Metadata } from "next";
import Link from "next/link";
import AudioCutter from "@/components/audio-cutter/AudioCutter";
import HowItWorks from "@/components/seo/HowItWorks";
import FAQ from "@/components/seo/FAQ";

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak.app/audio-cutter' },
  title: "Audio Cutter Online Free — Trim & Cut Any Audio File | Wavepeak",
  description: "Cut and trim any audio file online for free. Works in your browser — no upload, no server. Supports MP3, WAV, FLAC, M4A, AAC, OGG, OPUS.",
  openGraph: {
    title: "Audio Cutter Online Free — Trim & Cut Any Audio File | Wavepeak",
    description: "Cut and trim any audio file online for free. No upload required. Supports all major formats.",
    url: "https://wavepeak.app/audio-cutter",
    siteName: "Wavepeak",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Audio Cutter Online Free | Wavepeak",
    description: "Trim and cut any audio file in your browser. Free, no upload.",
  },
};

const steps = [
  {
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>,
    title: "Upload your audio file",
    description: "Drag and drop or click to select any audio file in MP3, WAV, FLAC, M4A, AAC, OGG, or OPUS format.",
  },
  {
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>,
    title: "Set start and end points",
    description: "Drag the handles on the waveform to select the exact section you want to keep. Use Play to preview your selection.",
  },
  {
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 3v13.5m-4.5-4.5L12 16.5l4.5-4.5" /></svg>,
    title: "Cut and download",
    description: "Click Cut — the selected segment is extracted in your browser. Download the trimmed file instantly.",
  },
];

const faq = [
  {
    question: "What audio formats does the cutter support?",
    answer: "You can cut MP3, WAV, FLAC, M4A, AAC, OGG, and OPUS files. The output format matches the input.",
  },
  {
    question: "Can I preview my selection before cutting?",
    answer: "Yes. Use the Play button to listen to the selected segment before you cut it.",
  },
  {
    question: "Will cutting reduce the audio quality?",
    answer: "The audio is re-encoded to ensure accurate cut points, which may slightly affect quality. For lossless formats like FLAC and WAV the quality loss is imperceptible.",
  },
  {
    question: "Is my file uploaded to a server?",
    answer: "No. All processing happens locally in your browser using FFmpeg.wasm. Your audio never leaves your device.",
  },
  {
    question: "Is there a file size limit?",
    answer: "There's no strict limit, but very large files (100 MB+) may slow down the browser since everything runs locally.",
  },
];

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Audio Cutter</h1>
          <p className="text-muted-foreground">Trim and cut any audio file — right in your browser. No upload, no server.</p>
        </div>
        <AudioCutter />
        <HowItWorks steps={steps} />
        <FAQ items={faq} />
      </main>

      <footer className="border-t border-border/50 px-6 py-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wavepeak. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
