import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak-iota.vercel.app/wav-to-mp3' },
  title: "WAV to MP3 Converter Online Free | Wavepeak",
  description: "Convert WAV to MP3 online for free. Choose quality up to 320 kbps. Works in your browser — no upload, no server.",
  openGraph: {
    title: "WAV to MP3 Converter Online Free | Wavepeak",
    description: "Convert WAV to MP3 online. Up to 320 kbps, works in browser, no upload required.",
    url: "https://wavepeak-iota.vercel.app/wav-to-mp3",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="WAV to MP3 Converter"
      description="Convert WAV files to compressed MP3 — right in your browser. No upload, no server."
      defaultFrom="WAV"
      defaultTo="MP3"
    />
  );
}
