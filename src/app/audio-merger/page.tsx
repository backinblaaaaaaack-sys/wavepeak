import type { Metadata } from "next";
import Link from "next/link";
import AudioMerger from "@/components/audio-merger/AudioMerger";
import HowItWorks from "@/components/seo/HowItWorks";
import FAQ from "@/components/seo/FAQ";

const steps = [
  { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>, title: "Upload your audio files", description: "Drop two or more audio files at once. You can add more files afterwards using the 'Add more files' button." },
  { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" /></svg>, title: "Reorder files", description: "Drag each file up or down to set the playback order. The files will be joined in the order shown." },
  { icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 3v13.5m-4.5-4.5L12 16.5l4.5-4.5" /></svg>, title: "Merge and download", description: "Click Merge — all files are joined into one seamless MP3 in your browser. Download the result instantly." },
];

const faq = [
  { question: "How many files can I merge?", answer: "There is no hard limit. You can merge as many files as your browser's memory allows. Practically, 10–20 files work smoothly." },
  { question: "Can I merge files of different formats?", answer: "Yes. The merger accepts MP3, WAV, FLAC, M4A, AAC, OGG, and OPUS — all mixed together. The output is always MP3." },
  { question: "Can I change the order of the files?", answer: "Yes. Drag each file row up or down to reorder before merging." },
  { question: "What format is the merged file?", answer: "The output is a 192 kbps MP3, which offers a good balance of quality and file size." },
  { question: "Is my audio uploaded to a server?", answer: "No. Merging happens entirely in your browser with FFmpeg.wasm. Your files stay on your device." },
];

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
