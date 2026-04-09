import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import { Activity, BarChart3, MapPin, Gauge, Users, MessageSquare } from 'lucide-react';
import InteractiveMap from '@/components/InteractiveMap';

export default function Services() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('batteryiq_session'));
  }, []);

  const services = [
    { 
      icon: <Activity className="w-7 h-7" />, 
      title: 'AI Health Predictor', 
      desc: 'Input 17 sensor features and get instant predictions: stress level (Low/Medium/High), health score (0-100), remaining useful life. Powered by models trained on NASA battery data.', 
      tag: 'Core',
      onClick: () => {
        if (isLoggedIn) navigate('/dashboard');
        else navigate('/login');
      }
    },
    { icon: <BarChart3 className="w-7 h-7" />, title: 'Fleet Dashboard', desc: 'Real-time overview of your entire fleet. Color-coded battery health cards, aggregate statistics, trend charts, and exportable reports. See which vehicles need attention at a glance.', tag: 'Monitoring' },
    { icon: <MapPin className="w-7 h-7" />, title: 'Charger Locator', desc: 'Interactive map showing the nearest EV charging stations and BatteryIQ-certified repair shops. Filter by charger type, availability, and power output.', tag: 'Navigation' },
    { icon: <MessageSquare className="w-7 h-7" />, title: 'AI Chatbot', desc: 'An intelligent assistant ready to answer your questions about battery health, maintenance schedules, and predictive alerts in real-time.', tag: 'Assistant' },
    { icon: <Users className="w-7 h-7" />, title: 'ROI Calculator', desc: 'Input your fleet size, average cycles, and chemistry type. Get projected savings, ROI timeline, and comparison against industry benchmarks.', tag: 'Business' },
  ];

  return (
    <Layout>
      <section className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Services</span>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-3">
                Intelligent <span className="text-gradient">Battery Services</span>
              </h1>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                From prediction to prevention — a complete suite of tools to keep your fleet at peak performance.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <ScrollReveal key={s.title} delay={i * 80}>
                <TiltCard>
                  <div 
                    onClick={s.onClick}
                    className={`glass cyber-border cyber-border-hover rounded-2xl p-6 h-full group ${s.onClick ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:glow-primary transition-all duration-300">
                        {s.icon}
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">{s.tag}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>

          {/* Charger Map placeholder */}
          <div id="charger" className="mt-24">
            <ScrollReveal>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-foreground">
                  <span className="text-gradient">Locate</span> a Charger
                </h2>
                <p className="text-muted-foreground mt-2">Find the nearest EV charging stations and repair shops</p>
              </div>
            </ScrollReveal>
            <ScrollReveal>
            <div className="glass cyber-border rounded-2xl overflow-hidden" style={{ height: '500px' }}>
              <InteractiveMap />
            </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
