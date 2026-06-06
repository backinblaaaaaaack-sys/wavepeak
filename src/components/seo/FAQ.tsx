interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
}

export default function FAQ({ items }: Props) {
  return (
    <section className="mt-12 pt-10 border-t border-border/40">
      <h2 className="text-lg font-semibold text-foreground mb-6">Frequently asked questions</h2>
      <div className="flex flex-col gap-5">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <h3 className="text-sm font-semibold text-foreground">{item.question}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
