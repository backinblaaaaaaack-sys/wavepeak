import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak.app/flac-to-wav' },
  title: "FLAC to WAV Converter Online Free | Wavepeak",
  description: "Convert FLAC to WAV online for free. Works in your browser — no upload, no server.",
  openGraph: {
    title: "FLAC to WAV Converter Online Free | Wavepeak",
    description: "Convert FLAC to WAV online for free. No upload required.",
    url: "https://wavepeak.app/flac-to-wav",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="FLAC to WAV Converter"
      description="Convert FLAC to WAV — right in your browser. No upload, no server."
      defaultFrom="FLAC"
      defaultTo="WAV"
    />
  );
}
