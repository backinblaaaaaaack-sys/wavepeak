import type { Metadata } from "next";
import ConverterPage from "@/components/audio-converter/ConverterPage";

export const metadata: Metadata = {
  title: "WAV to AAC Converter Online Free | Wavepeak",
  description: "Convert WAV to AAC online for free. Works in your browser — no upload, no server.",
  openGraph: {
    title: "WAV to AAC Converter Online Free | Wavepeak",
    description: "Convert WAV to AAC online for free. No upload required.",
    url: "https://wavepeak-iota.vercel.app/wav-to-aac",
    siteName: "Wavepeak",
    type: "website",
  },
};

export default function Page() {
  return (
    <ConverterPage
      title="WAV to AAC Converter"
      description="Convert WAV to AAC — right in your browser. No upload, no server."
      defaultFrom="WAV"
      defaultTo="AAC"
    />
  );
}
