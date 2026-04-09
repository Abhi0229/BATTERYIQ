import { TrendingUp, Clock, DollarSign, Eye } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const benefits = [
  {
    icon: <Eye className="w-8 h-8" />,
    title: 'Find Out When Batteries Will Fail — Before They Do',
    desc: 'BatteryIQ alerts you to issues early, giving you time to fix or replace the battery and avoid financial or reputational risk. Proactive intelligence, not reactive guesswork.',
    stats: [{ label: 'Early detection rate', value: '94%' }, { label: 'Fewer surprise failures', value: '78%' }],
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'Forecast Future Performance',
    desc: 'Predictive monitoring forecasts the future behavior of your batteries, so you can act to maximize their lifespan. Optimize charging cycles and operating conditions with data-driven confidence.',
    stats: [{ label: 'Avg lifespan increase', value: '30%' }, { label: 'Fewer replacements', value: '45%' }],
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: 'Reduce Downtime by 60%',
    desc: 'Real-time health monitoring and proactive alerts ensure batteries are serviced before they fail. Your fleet stays on the road, not in the shop.',
    stats: [{ label: 'Downtime reduction', value: '60%' }, { label: 'Faster diagnostics', value: '10x' }],
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: 'Save $120K+ Annually per 50 Vehicles',
    desc: 'Between extended battery life, reduced emergency replacements, and optimized charging patterns, BatteryIQ delivers measurable ROI from day one.',
    stats: [{ label: 'Annual savings', value: '$120K+' }, { label: 'ROI payback', value: '3 months' }],
  },
];

export default function Benefits() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-20">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Why BatteryIQ</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3">
              Stay Proactive with <span className="text-gradient">BatteryIQ</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Reliable, scalable & fast smart battery monitoring for your business.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-20">
          {benefits.map((b, i) => (
            <ScrollReveal key={b.title} direction={i % 2 === 0 ? 'left' : 'right'}>
              <div className={`flex flex-col lg:flex-row items-center gap-12 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1 w-full">
                  <div className="glass cyber-border rounded-2xl p-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="text-primary mb-6">{b.icon}</div>
                    <div className="grid grid-cols-2 gap-4">
                      {b.stats.map((s) => (
                        <div key={s.label} className="bg-secondary/30 rounded-xl p-4">
                          <div className="text-2xl font-bold font-mono text-gradient">{s.value}</div>
                          <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">{b.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
