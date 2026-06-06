import Link from "next/link";
import { CONVERSION_PAIRS } from "@/lib/converters";

export default function PopularConversions() {
  return (
    <section className="max-w-6xl mx-auto w-full px-6 py-12">
      <h2 className="text-xl font-semibold text-foreground mb-6">Popular Conversions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {CONVERSION_PAIRS.map((pair) => (
          <Link
            key={pair.slug}
            href={`/${pair.slug}`}
            className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
          >
            {pair.from} to {pair.to}
          </Link>
        ))}
      </div>
    </section>
  );
}
