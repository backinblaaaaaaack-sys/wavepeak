import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  title: "AAC to FLAC Converter Online Free | Wavepeak",
  description: "Convert AAC to FLAC online for free. Works in your browser — no upload, no server.",
  openGraph: {
    title: "AAC to FLAC Converter Online Free | Wavepeak",
    description: "Convert AAC to FLAC online for free. No upload required.",
    url: "https://wavepeak-iota.vercel.app/aac-to-flac",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="AAC to FLAC Converter"
      description="Convert AAC to FLAC — right in your browser. No upload, no server."
      defaultFrom="AAC"
      defaultTo="FLAC"
    />
  );
}
