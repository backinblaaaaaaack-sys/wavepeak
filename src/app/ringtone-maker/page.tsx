import type { Metadata } from "next";
import Link from "next/link";
import RingtoneMaker from "@/components/ringtone-maker/RingtoneMaker";

export const metadata: Metadata = {
  title: "Ringtone Maker Online Free — Create Ringtones from Any Song | Wavepeak",
  description: "Create ringtones from any song online for free. Export as M4R for iPhone or MP3 for Android. Works in your browser — no upload, no server.",
  openGraph: {
    title: "Ringtone Maker Online Free — Create Ringtones from Any Song | Wavepeak",
    description: "Create ringtones from any song. Export as M4R for iPhone or MP3 for Android. Free, no upload.",
    url: "https://wavepeak-iota.vercel.app/ringtone-maker",
    siteName: "Wavepeak",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ringtone Maker Online Free | Wavepeak",
    description: "Create ringtones from any song. iPhone M4R & Android MP3. Free, works in browser.",
  },
};

export default function RingtoneMakerPage() {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Ringtone Maker
          </h1>
          <p className="text-muted-foreground">
            Cut any song into a ringtone — export for iPhone or Android, right in your browser.
          </p>
        </div>
        <RingtoneMaker />
      </main>

      <footer className="border-t border-border/50 px-6 py-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Wavepeak. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
