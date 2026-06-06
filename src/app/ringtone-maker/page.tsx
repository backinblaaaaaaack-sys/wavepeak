import type { Metadata } from "next";
import Link from "next/link";
import RingtoneMaker from "@/components/ringtone-maker/RingtoneMaker";
import HowItWorks from "@/components/seo/HowItWorks";
import FAQ from "@/components/seo/FAQ";

const steps = [
  {
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>,
    title: "Upload any song",
    description: "Drop any audio file — MP3, WAV, FLAC, M4A, AAC, OGG, or OPUS. No account or app needed.",
  },
  {
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>,
    title: "Select up to 40 seconds",
    description: "Drag the handles on the waveform to pick the best part of the song. Preview it before exporting.",
  },
  {
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 3v13.5m-4.5-4.5L12 16.5l4.5-4.5" /></svg>,
    title: "Download for iPhone or Android",
    description: "Get your ringtone as M4R for iPhone or MP3 for Android. Both files are created at once.",
  },
];

const faq = [
  { question: "What is the maximum ringtone length?", answer: "iPhone ringtones must be 40 seconds or less. The handles on the waveform are limited to 40 seconds automatically." },
  { question: "What format do I need for iPhone?", answer: "iPhone uses the M4R format. After downloading, add the file to iTunes or Finder and sync it to set as a ringtone." },
  { question: "What format do I need for Android?", answer: "Android supports MP3 ringtones. Copy the downloaded MP3 to your phone's Ringtones folder or set it directly from the file manager." },
  { question: "Is my song uploaded anywhere?", answer: "No. All processing happens locally in your browser. Your music never leaves your device." },
  { question: "Is this ringtone maker free?", answer: "Yes, completely free. No account, no subscription, and no watermarks on your ringtones." },
];

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak-iota.vercel.app/ringtone-maker' },
  title: "Ringtone Maker Online Free — Create Ringtones from Any Song | Wavepeak",
  description: "Create ringtones from any song online for free. Export as M4R for iPhone or MP3 for Android. Works in your browser — no upload, no server.",
  openGraph: {
    title: "Ringtone Maker Online Free — Create Ringtones from Any Song | Wavepeak",
    description: "Create ringtones from any song. Export as M4R for iPhone or MP3 for Android. Free, no upload.",
    url: "https://wavepeak-iota.vercel.app/ringtone-maker",
    siteName: "Wavepeak",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ringtone Maker Online Free | Wavepeak",
    description: "Create ringtones from any song. iPhone M4R & Android MP3. Free, works in browser.",
  },
};

export default function RingtoneMakerPage() {
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
            Ringtone Maker
          </h1>
          <p className="text-muted-foreground">
            Cut any song into a ringtone — export for iPhone or Android, right in your browser.
          </p>
        </div>
        <RingtoneMaker />
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
