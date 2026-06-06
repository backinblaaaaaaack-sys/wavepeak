import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak-iota.vercel.app/ogg-to-wav' },
  title: "OGG to WAV Converter Online Free | Wavepeak",
  description: "Convert OGG to WAV online for free. Works in your browser — no upload, no server.",
  openGraph: {
    title: "OGG to WAV Converter Online Free | Wavepeak",
    description: "Convert OGG to WAV online for free. No upload required.",
    url: "https://wavepeak-iota.vercel.app/ogg-to-wav",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="OGG to WAV Converter"
      description="Convert OGG to WAV — right in your browser. No upload, no server."
      defaultFrom="OGG"
      defaultTo="WAV"
    />
  );
}
