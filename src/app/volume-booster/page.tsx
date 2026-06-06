import type { Metadata } from "next";
import Link from "next/link";
import VolumeBooster from "@/components/volume-booster/VolumeBooster";
import HowItWorks from "@/components/seo/HowItWorks";
import FAQ from "@/components/seo/FAQ";

const steps = [
  { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>, title: "Upload your audio file", description: "Drag and drop any MP3, WAV, FLAC, M4A, AAC, OGG, or OPUS file. No account needed." },
  { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>, title: "Set the volume level", description: "Drag the slider from 100% to 500%. Watch the hint to avoid clipping. Use Play to preview the result." },
  { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 3v13.5m-4.5-4.5L12 16.5l4.5-4.5" /></svg>, title: "Boost and download", description: "Click Boost Volume — FFmpeg applies the gain in your browser. Download the louder file in seconds." },
];

const faq = [
  { question: "How much can I boost the volume?", answer: "You can boost from 100% (original) up to 500% (5× louder). We recommend staying under 200% to avoid distortion." },
  { question: "What does 'Warning: may clip' mean?", answer: "Clipping happens when the boosted signal exceeds the maximum level, causing distortion. It's most noticeable on already-loud tracks. Try a lower boost if you hear crackling." },
  { question: "Does boosting change the file format?", answer: "No. The output keeps the same format as the input — boost an MP3, get an MP3 back." },
  { question: "Can I preview the volume before processing?", answer: "Yes. Click Play to hear the audio at the selected volume level in real time using your browser's audio engine." },
  { question: "Is my file uploaded to a server?", answer: "No. Everything is processed locally using FFmpeg.wasm. Your audio never leaves your device." },
];

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak-iota.vercel.app/volume-booster' },
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
