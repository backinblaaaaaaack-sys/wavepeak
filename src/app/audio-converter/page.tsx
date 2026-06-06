import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

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

export default function Page() {
  return (
    <ConverterPage
      title="Audio Converter"
      description="Convert between any audio formats — right in your browser. No upload, no server."
      defaultFrom="MP3"
      defaultTo="MP3"
      showPopular
    />
  );
}
