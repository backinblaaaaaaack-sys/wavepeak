import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  title: "WAV to FLAC Converter Online Free | Wavepeak",
  description: "Convert WAV to FLAC online for free. Works in your browser — no upload, no server.",
  openGraph: {
    title: "WAV to FLAC Converter Online Free | Wavepeak",
    description: "Convert WAV to FLAC online for free. No upload required.",
    url: "https://wavepeak-iota.vercel.app/wav-to-flac",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="WAV to FLAC Converter"
      description="Convert WAV to FLAC — right in your browser. No upload, no server."
      defaultFrom="WAV"
      defaultTo="FLAC"
    />
  );
}
