interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Props {
  steps: Step[];
}

export default function HowItWorks({ steps }: Props) {
  return (
    <section className="mt-16 pt-12 border-t border-border/40">
      <h2 className="text-lg font-semibold text-foreground mb-8">How it works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-600/15 text-violet-400 shrink-0">
                {step.icon}
              </div>
              <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                Step {i + 1}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
