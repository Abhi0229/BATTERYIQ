import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import TiltCard from '@/components/TiltCard';
import { Monitor, HardDrive, Check, ArrowRight } from 'lucide-react';

const software = [
  {
    id: 'batteryiq-cloud',
    name: 'BatteryIQ Cloud',
    price: '$299',
    period: '/month',
    desc: 'Real-time battery analytics platform with AI-powered health predictions, fleet monitoring, and predictive maintenance alerts.',
    features: ['AI Health Predictor', 'Fleet Dashboard', 'Predictive Alerts', 'CSV Batch Analysis', 'Email Reports', 'API Access (1K calls/mo)'],
    highlight: false,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  },
  {
    id: 'batteryiq-pro',
    name: 'BatteryIQ Pro',
    price: '$799',
    period: '/month',
    desc: 'Enterprise-grade analytics with unlimited API access, custom ML model training, and dedicated support.',
    features: ['Everything in Cloud', 'Unlimited API', 'Custom Models', 'White-label Dashboard', 'Priority Support', 'On-premise Option'],
    highlight: true,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
  },
  {
    id: 'batteryiq-enterprise',
    name: 'BatteryIQ Enterprise',
    price: 'Custom',
    period: '',
    desc: 'Fully customized deployment with dedicated infrastructure, SLA guarantees, and integration engineering.',
    features: ['Everything in Pro', 'Dedicated Infra', '99.99% SLA', 'Custom Integrations', 'Training & Onboarding', '24/7 Support'],
    highlight: false,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
  },
];

const hardware = [
  {
    id: 'bms-pro-module',
    name: 'BMS Pro Module',
    price: '$4,200',
    period: '/unit',
    desc: 'Advanced Battery Management System with real-time cell monitoring, thermal management, and BatteryIQ cloud integration.',
    features: ['96-cell monitoring', 'Thermal sensors', 'CAN/Ethernet interface', 'Cloud connectivity', 'IP67 rated', '5-year warranty'],
    highlight: true,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
  },
  {
    id: 'sensor-array-kit',
    name: 'Sensor Array Kit',
    price: '$1,800',
    period: '/kit',
    desc: 'Retrofit sensor package for existing battery packs. Adds impedance, temperature, and voltage monitoring.',
    features: ['12 temp sensors', 'Impedance analyzer', 'Voltage monitor', 'Easy retrofit', 'Plug & play', '3-year warranty'],
    highlight: false,
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop',
  },
  {
    id: 'fleet-gateway',
    name: 'Fleet Gateway',
    price: '$2,400',
    period: '/unit',
    desc: 'Edge computing gateway that aggregates data from multiple BMS modules and transmits to BatteryIQ cloud.',
    features: ['Up to 50 BMS connections', '4G/WiFi/Ethernet', 'Edge processing', 'Encrypted data', 'OTA updates', 'DIN rail mount'],
    highlight: false,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
  },
];

export default function Products() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'hardware' ? 'hardware' : 'software';
  const [tab, setTab] = useState<'software' | 'hardware'>(initialTab);

  const products = tab === 'software' ? software : hardware;

  return (
    <Layout>
      <section className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Products</span>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-3">
                <span className="text-gradient">Software & Hardware</span> Solutions
              </h1>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                From cloud analytics to ruggedized BMS modules — everything you need to electrify with confidence.
              </p>
            </div>
          </ScrollReveal>

          <div className="flex justify-center mb-16">
            <div className="glass rounded-xl p-1 inline-flex">
              {[
                { key: 'software' as const, icon: <Monitor className="w-4 h-4" />, label: 'Software' },
                { key: 'hardware' as const, icon: <HardDrive className="w-4 h-4" />, label: 'Hardware' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${tab === t.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <ScrollReveal key={p.name} delay={i * 100}>
                <TiltCard>
                  <div className={`rounded-2xl h-full flex flex-col overflow-hidden ${p.highlight ? 'glass cyber-border glow-primary' : 'glass cyber-border'}`}>
                    <div className="h-48 overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-7 flex flex-col flex-1">
                      {p.highlight && (
                        <div className="text-xs font-semibold text-primary mb-4 uppercase tracking-wider">Most Popular</div>
                      )}
                      <h3 className="text-xl font-bold text-foreground">{p.name}</h3>
                      <div className="flex items-baseline gap-1 mt-3">
                        <span className="text-3xl font-bold text-gradient">{p.price}</span>
                        <span className="text-sm text-muted-foreground">{p.period}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3 mb-6">{p.desc}</p>
                      <ul className="space-y-2.5 mb-8 flex-1">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                            <Check className="w-4 h-4 text-accent flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={`/products/${p.id}`}
                        className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 bg-primary text-primary-foreground hover:opacity-90 glow-primary"
                      >
                        Know More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
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
