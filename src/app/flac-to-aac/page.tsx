import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak-iota.vercel.app/flac-to-aac' },
  title: "FLAC to AAC Converter Online Free | Wavepeak",
  description: "Convert FLAC to AAC online for free. Works in your browser — no upload, no server.",
  openGraph: {
    title: "FLAC to AAC Converter Online Free | Wavepeak",
    description: "Convert FLAC to AAC online for free. No upload required.",
    url: "https://wavepeak-iota.vercel.app/flac-to-aac",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="FLAC to AAC Converter"
      description="Convert FLAC to AAC — right in your browser. No upload, no server."
      defaultFrom="FLAC"
      defaultTo="AAC"
    />
  );
}
