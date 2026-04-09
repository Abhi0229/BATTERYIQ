import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    price: '$299',
    period: '/month',
    desc: 'For small fleets getting started with battery intelligence.',
    limit: 'Up to 25 vehicles',
    features: ['AI Health Predictor', 'Fleet Dashboard', 'Email Alerts', 'CSV Upload', 'Basic Reports', 'Email Support'],
    cta: 'Start Free Trial',
    highlight: false,
  },
  {
    name: 'Professional',
    price: '$799',
    period: '/month',
    desc: 'For growing fleets that need advanced analytics and API access.',
    limit: 'Up to 100 vehicles',
    features: ['Everything in Starter', 'API Access (10K/mo)', 'Predictive Maintenance', 'Custom Alerts', 'Priority Support', 'Charger Locator'],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large fleets requiring dedicated infrastructure and SLA.',
    limit: 'Unlimited vehicles',
    features: ['Everything in Pro', 'Unlimited API', 'Custom ML Models', 'On-premise Deploy', '99.99% SLA', '24/7 Dedicated Support'],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <Layout>
      <section className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Pricing</span>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-3">
                Plans That <span className="text-gradient">Scale</span> With You
              </h1>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                Start free, upgrade as your fleet grows. All plans include a 14-day free trial.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((p, i) => (
              <ScrollReveal key={p.name} delay={i * 100}>
                <TiltCard>
                  <div className={`rounded-2xl p-7 h-full flex flex-col ${p.highlight ? 'glass cyber-border glow-primary relative' : 'glass cyber-border'}`}>
                    {p.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold bg-primary text-primary-foreground px-3 py-1 rounded-full">Recommended</div>}
                    <h3 className="text-xl font-bold text-foreground">{p.name}</h3>
                    <div className="flex items-baseline gap-1 mt-3">
                      <span className="text-4xl font-bold text-gradient">{p.price}</span>
                      <span className="text-sm text-muted-foreground">{p.period}</span>
                    </div>
                    <div className="text-xs text-primary font-medium mt-2">{p.limit}</div>
                    <p className="text-sm text-muted-foreground mt-3 mb-6">{p.desc}</p>
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                          <Check className="w-4 h-4 text-accent flex-shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                    <Link to={p.cta === 'Contact Sales' ? '/contact' : '/signup'} className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${p.highlight ? 'bg-primary text-primary-foreground hover:opacity-90' : 'border border-border/50 text-foreground hover:bg-secondary/50'}`}>
                      {p.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
