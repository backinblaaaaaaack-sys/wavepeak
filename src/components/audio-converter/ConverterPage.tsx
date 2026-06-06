import Link from "next/link";
import AudioConverter, { type AudioFormat } from "./AudioConverter";
import PopularConversions from "@/components/popular-conversions/PopularConversions";

interface Props {
  title: string;
  description: string;
  defaultFrom: AudioFormat;
  defaultTo: AudioFormat;
  showPopular?: boolean;
  seoContent?: React.ReactNode;
}

export default function ConverterPage({ title, description, defaultFrom, defaultTo, showPopular = false, seoContent }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/50 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-xl font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity">
            Wave<span className="text-muted-foreground">peak</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <AudioConverter defaultFrom={defaultFrom} defaultTo={defaultTo} />
        {seoContent}
      </main>

      {showPopular && (
        <div className="border-t border-border/50">
          <PopularConversions />
        </div>
      )}

      <footer className="border-t border-border/50 px-6 py-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wavepeak. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
