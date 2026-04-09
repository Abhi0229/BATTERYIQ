import { Cable, Brain, BellRing } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import TiltCard from './TiltCard';

const steps = [
  {
    step: '01',
    icon: <Cable className="w-8 h-8" />,
    title: 'Connect Your Batteries',
    desc: 'Plug in our BMS module or retrofit sensor kit to your existing battery packs. Telemetry data flows to the BatteryIQ cloud in real time via 4G, WiFi, or Ethernet.',
  },
  {
    step: '02',
    icon: <Brain className="w-8 h-8" />,
    title: 'AI Analyzes & Predicts',
    desc: 'Our 4 ML models — trained on NASA battery research data — ingest 17 sensor features to score stress, health, remaining useful life, and efficiency with 97%+ accuracy.',
  },
  {
    step: '03',
    icon: <BellRing className="w-8 h-8" />,
    title: 'Get Alerts & Insights',
    desc: 'Receive predictive maintenance alerts before failures happen. "Battery B4 on Truck #12 needs servicing in ~14 cycles." Dashboards, reports, and API access included.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 gradient-radial opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">How It Works</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3">
              Our AI Makes the <span className="text-gradient">Impossible Possible</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Connect your batteries to our cloud and start receiving predictive insights in minutes — not months.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <ScrollReveal key={s.step} delay={i * 150}>
              <TiltCard>
                <div className="glass cyber-border cyber-border-hover rounded-2xl p-8 h-full text-center group">
                  <div className="text-5xl font-black text-primary/10 mb-4 font-mono">{s.step}</div>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 text-primary group-hover:glow-primary transition-all duration-300">
                    {s.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-primary/30">→</div>
                  )}
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
