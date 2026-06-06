import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  alternates: { canonical: 'https://wavepeak-iota.vercel.app/m4a-to-flac' },
  title: "M4A to FLAC Converter Online Free | Wavepeak",
  description: "Convert M4A to FLAC online for free. Works in your browser — no upload, no server.",
  openGraph: {
    title: "M4A to FLAC Converter Online Free | Wavepeak",
    description: "Convert M4A to FLAC online for free. No upload required.",
    url: "https://wavepeak-iota.vercel.app/m4a-to-flac",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="M4A to FLAC Converter"
      description="Convert M4A to FLAC — right in your browser. No upload, no server."
      defaultFrom="M4A"
      defaultTo="FLAC"
    />
  );
}
