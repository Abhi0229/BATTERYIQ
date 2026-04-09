import { Truck, Battery, Server, Radio, Wrench, Bot } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import TiltCard from './TiltCard';

const industries = [
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Vehicles',
    desc: 'Fleet operators managing electric trucks, buses, vans, AGVs, forklifts, or drones get advanced monitoring throughout the entire battery lifecycle — maximizing uptime and predictability.',
  },
  {
    icon: <Battery className="w-8 h-8" />,
    title: 'Energy Storage',
    desc: 'Solar and wind installations achieve peak efficiency when paired with monitored batteries. Real-time insights and instant alerts keep energy storage systems fully operational.',
  },
  {
    icon: <Server className="w-8 h-8" />,
    title: 'Backup Batteries',
    desc: 'Lead-acid and lithium backup batteries must perform flawlessly during outages. Continuous monitoring enables proactive servicing and ensures uninterrupted reliability.',
  },
  {
    icon: <Radio className="w-8 h-8" />,
    title: 'IoT Sensors',
    desc: 'IoT-connected sensors rely on batteries for critical data transmission. Predictive insights prevent unexpected failures and recommend optimal maintenance windows.',
  },
  {
    icon: <Wrench className="w-8 h-8" />,
    title: 'Power Tools',
    desc: 'Manufacturers ensure sufficient components for warranty replacements while planning new launches. Comprehensive lifecycle insights empower informed resource planning.',
  },
  {
    icon: <Bot className="w-8 h-8" />,
    title: 'Robots',
    desc: 'Minimize operational downtime, schedule maintenance proactively, and facilitate second-life repurposing. Maximize operational efficiency and investment value.',
  },
];

export default function Industries() {
  return (
    <section className="py-24 lg:py-32 border-t border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Trust BatteryIQ</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3">
              Built for <span className="text-gradient">Every Industry</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Whether it's a single unit or a full-scale fleet, power your business with intelligent battery monitoring solutions.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 100}>
              <TiltCard>
                <div className="glass cyber-border cyber-border-hover rounded-2xl p-7 h-full group cursor-default">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 text-primary group-hover:glow-primary transition-all duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
