import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import { Zap, Target, Globe, Award, Users, TrendingUp } from 'lucide-react';

const timeline = [
  { year: '2022', title: 'Founded in Mumbai', desc: 'Started with a vision to bring AI intelligence to EV battery management.' },
  { year: '2023', title: 'NASA Dataset Partnership', desc: 'Gained access to NASA\'s battery cycling research data for model training.' },
  { year: '2023', title: 'Models Achieve 97%+ Accuracy', desc: 'All 4 ML models (stress, health, RUL, efficiency) hit production-grade accuracy.' },
  { year: '2024', title: '10,000 Batteries Monitored', desc: 'Deployed across multiple fleet operators in India and Southeast Asia.' },
  { year: '2025', title: 'Series A & Global Expansion', desc: 'Expanding to Europe and North America with enterprise partnerships.' },
];

const team = [
  { name: 'Arjun Mehta', role: 'CEO & Co-founder', desc: 'Ex-Tesla battery engineer. PhD in Electrochemistry from IIT Bombay.' },
  { name: 'Priya Sharma', role: 'CTO & Co-founder', desc: 'ML researcher specializing in time-series prediction. Ex-Google Brain.' },
  { name: 'Vikram Patel', role: 'VP Engineering', desc: '15 years in fleet telematics. Previously built Ola\'s EV monitoring stack.' },
  { name: 'Sarah Chen', role: 'Head of Data Science', desc: 'Published 12 papers on battery degradation modeling. Ex-NASA JPL.' },
];

const values = [
  { icon: <Target className="w-6 h-6" />, title: 'Precision First', desc: 'Every prediction is backed by rigorous ML models validated against real-world data.' },
  { icon: <Globe className="w-6 h-6" />, title: 'Sustainability', desc: 'Extending battery life means less mining, less waste, and a cleaner planet.' },
  { icon: <Award className="w-6 h-6" />, title: 'Transparency', desc: 'Open about our methodologies, accuracy metrics, and data handling practices.' },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 relative">
        <div className="absolute inset-0 gradient-radial opacity-30" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <ScrollReveal>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">About Us</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-4">
              Building the <span className="text-gradient">Future of EV</span> Battery Intelligence
            </h1>
            <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
              We're a team of battery scientists, ML engineers, and fleet operators united by a single mission: 
              make every EV battery last longer and perform better.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 100}>
                <div className="glass cyber-border rounded-2xl p-7 h-full text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">{v.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 border-t border-border/20">
        <div className="max-w-3xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-foreground text-center mb-16">Our <span className="text-gradient">Journey</span></h2>
          </ScrollReveal>
          <div className="space-y-0 relative">
            <div className="absolute left-[22px] top-0 bottom-0 w-px bg-border/30" />
            {timeline.map((t, i) => (
              <ScrollReveal key={t.year + t.title} delay={i * 100}>
                <div className="flex gap-6 pb-10">
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold font-mono text-primary border-2 border-primary/30">
                      {t.year.slice(-2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-primary font-mono mb-1">{t.year}</div>
                    <h3 className="text-lg font-semibold text-foreground">{t.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 border-t border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-foreground text-center mb-16">The <span className="text-gradient">Team</span></h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 100}>
                <div className="glass cyber-border cyber-border-hover rounded-2xl p-6 text-center group">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{t.name}</h3>
                  <div className="text-xs text-primary mt-1">{t.role}</div>
                  <p className="text-xs text-muted-foreground mt-3">{t.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-t border-border/20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="glass rounded-2xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: '10K+', label: 'Batteries Monitored' },
              { val: '50+', label: 'Fleet Customers' },
              { val: '97%', label: 'Prediction Accuracy' },
              { val: '4', label: 'Countries' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-gradient">{s.val}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
