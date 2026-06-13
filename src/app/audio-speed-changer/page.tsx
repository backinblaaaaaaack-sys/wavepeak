import type { Metadata } from "next";
import Link from "next/link";
import AudioSpeedChanger from "@/components/audio-speed-changer/AudioSpeedChanger";
import HowItWorks from "@/components/seo/HowItWorks";
import FAQ from "@/components/seo/FAQ";

const steps = [
  { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>, title: "Upload your audio file", description: "Drag and drop any MP3, WAV, FLAC, M4A, AAC, OGG, or OPUS file to get started." },
  { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811V8.69zM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061a1.125 1.125 0 01-1.683-.977V8.69z" /></svg>, title: "Choose the speed", description: "Use the slider or tap a preset — 0.5x to slow down, 1.5x or 2x to speed up. Hit Play to hear it instantly." },
  { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 3v13.5m-4.5-4.5L12 16.5l4.5-4.5" /></svg>, title: "Export and download", description: "Click Change Speed — FFmpeg processes the file in your browser. Download the result in the same format." },
];

const faq = [
  { question: "Does changing speed affect the pitch?", answer: "No. Wavepeak uses FFmpeg's atempo filter which changes the tempo without altering the pitch. Speech and music keep their natural tone." },
  { question: "What speed range is supported?", answer: "You can go from 0.5× (half speed) to 3.0× (triple speed). Common presets like 0.75×, 1.25×, 1.5×, and 2× are one click away." },
  { question: "Can I preview the speed before exporting?", answer: "Yes. Click Play to hear the audio at the selected speed in real time. Moving the slider while playing updates the speed instantly." },
  { question: "What format will the output be?", answer: "The output keeps the same format as the input — speed up an MP3, get an MP3 back." },
  { question: "Is my file uploaded to a server?", answer: "No. All processing is done locally in your browser with FFmpeg.wasm. Your audio never leaves your device." },
];

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak.app/audio-speed-changer' },
  title: "Audio Speed Changer Online Free — Speed Up or Slow Down Any Audio | Wavepeak",
  description: "Change the speed of any audio file online for free. Speed up or slow down without changing the pitch. Supports MP3, WAV, FLAC, M4A, AAC, OGG, OPUS. Works in your browser.",
  openGraph: {
    title: "Audio Speed Changer Online Free — Speed Up or Slow Down Any Audio | Wavepeak",
    description: "Speed up or slow down any audio file online for free. No pitch change, no upload required.",
    url: "https://wavepeak.app/audio-speed-changer",
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
