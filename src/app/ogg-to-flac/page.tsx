import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak.app/ogg-to-flac' },
  title: "OGG to FLAC Converter Online Free | Wavepeak",
  description: "Convert OGG to FLAC online for free. Works in your browser — no upload, no server.",
  openGraph: {
    title: "OGG to FLAC Converter Online Free | Wavepeak",
    description: "Convert OGG to FLAC online for free. No upload required.",
    url: "https://wavepeak.app/ogg-to-flac",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="OGG to FLAC Converter"
      description="Convert OGG to FLAC — right in your browser. No upload, no server."
      defaultFrom="OGG"
      defaultTo="FLAC"
    />
  );
}
