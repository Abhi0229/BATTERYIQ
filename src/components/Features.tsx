import { Activity, MessageSquareText, MapPin, Shield, Cpu, Zap, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';
import TiltCard from './TiltCard';

const features = [
  { icon: <Activity className="w-6 h-6" />, title: 'AI Health Predictor', desc: 'Input 17 sensor features and get instant predictions: stress level, health score (0-100), and useful life. Powered by NASA battery data.', tag: 'Core', color: 'text-primary', link: '/dashboard' },
  { icon: <Zap className="w-6 h-6" />, title: 'ROI Calculator', desc: 'Input your fleet size and chemistry type. Get projected savings, ROI timeline, and business benchmarks.', tag: 'Business', color: 'text-accent', link: '/roi-calculator' },
  { icon: <MapPin className="w-6 h-6" />, title: 'Charger Locator', desc: 'Interactive map showing the nearest EV charging stations and certified repair shops. Filter by charger type.', tag: 'Navigation', color: 'text-cyan-400', link: '/services#charger' },
  { icon: <BarChart3 className="w-6 h-6" />, title: 'Fleet Analytics', desc: 'Deep technical analysis with raw sensor data, impedance curves, and aggregate health trends for teams.', tag: 'Tech', color: 'text-primary', link: '/dashboard' },
  { icon: <MessageSquareText className="w-6 h-6" />, title: 'AI Chatbot', desc: 'Ask anything about your batteries. Our intelligent assistant answers questions about maintenance and specs.', tag: 'AI', color: 'text-accent', link: '/#chatbot' },
  { icon: <Shield className="w-6 h-6" />, title: 'Predictive Defense', desc: 'Get alerts before failures happen. Our AI predicts when batteries need servicing based on degradation.', tag: 'Safety', color: 'text-cyan-400', link: '/services#maintenance' },
];

export default function Features() {
  return (
    <section className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 gradient-radial opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Features</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3">
              Everything You Need to <span className="text-gradient">Monitor & Predict</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              From real-time diagnostics to predictive maintenance — BatteryIQ gives your fleet the intelligence edge.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 100}>
              <TiltCard>
                <Link to={f.link} className="block h-full">
                  <div className="glass cyber-border cyber-border-hover rounded-2xl p-7 h-full group cursor-pointer">
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ${f.color} group-hover:glow-primary transition-all duration-300`}>
                        {f.icon}
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground bg-white/5 px-2 py-1 rounded">{(f as any).tag}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </Link>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
