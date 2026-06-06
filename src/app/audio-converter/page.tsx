import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";
import HowItWorks from "@/components/seo/HowItWorks";
import FAQ from "@/components/seo/FAQ";

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak-iota.vercel.app/audio-converter' },
  title: "Audio Converter Online Free — Convert Any Audio Format | Wavepeak",
  description: "Convert any audio format online for free. MP3, WAV, FLAC, M4A, AAC, OGG, OPUS — all supported. Works in your browser, no upload required.",
  openGraph: {
    title: "Audio Converter Online Free | Wavepeak",
    description: "Convert any audio format online. MP3, WAV, FLAC, M4A, AAC, OGG, OPUS. Free, fast, no upload.",
    url: "https://wavepeak-iota.vercel.app/audio-converter",
    siteName: "Wavepeak",
    type: "website",
  },
};

const steps = [
  {
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>,
    title: "Upload your audio file",
    description: "Drag and drop or click to select any audio file. Supports MP3, WAV, FLAC, M4A, AAC, OGG, and OPUS formats.",
  },
  {
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" /></svg>,
    title: "Choose output format",
    description: "Select the source and target formats, then pick the quality. For MP3 choose 128, 192, or 320 kbps.",
  },
  {
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 3v13.5m-4.5-4.5L12 16.5l4.5-4.5" /></svg>,
    title: "Convert and download",
    description: "Click Convert — the file is processed entirely in your browser using FFmpeg. Download the result instantly.",
  },
];

const faq = [
  {
    question: "What audio formats can I convert between?",
    answer: "You can convert between MP3, WAV, FLAC, M4A, AAC, OGG, and OPUS in any direction. All 42 combinations are supported.",
  },
  {
    question: "Is my audio file uploaded to a server?",
    answer: "No. Everything happens locally in your browser using FFmpeg.wasm. Your file never leaves your device.",
  },
  {
    question: "What quality should I choose for MP3?",
    answer: "128 kbps is fine for voice and podcasts. 192 kbps is the recommended balance for music. 320 kbps is the best quality for audiophiles.",
  },
  {
    question: "Is it really free?",
    answer: "Yes, completely free. No account, no subscription, no hidden limits.",
  },
  {
    question: "How long does conversion take?",
    answer: "Most files convert in a few seconds. Larger files (50 MB+) may take 30–60 seconds since everything runs in the browser.",
  },
];

export default function Page() {
  return (
    <ConverterPage
      title="Audio Converter"
      description="Convert between any audio formats — right in your browser. No upload, no server."
      defaultFrom="MP3"
      defaultTo="MP3"
      showPopular
      seoContent={
        <>
          <HowItWorks steps={steps} />
          <FAQ items={faq} />
        </>
      }
    />
  );
}
