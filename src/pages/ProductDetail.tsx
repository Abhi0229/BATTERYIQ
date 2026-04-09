import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import { Check, ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react';

const allProducts: Record<string, {
  name: string;
  category: string;
  price: string;
  period: string;
  image: string;
  desc: string;
  longDesc: string;
  features: string[];
  specs: { label: string; value: string }[];
  buyLink: string;
}> = {
  'batteryiq-cloud': {
    name: 'BatteryIQ Cloud',
    category: 'Software',
    price: '$299',
    period: '/month',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop',
    desc: 'Real-time battery analytics platform with AI-powered health predictions.',
    longDesc: 'BatteryIQ Cloud is your central command center for battery intelligence. Monitor the health, stress levels, remaining useful life, and efficiency of every battery in your fleet from a single dashboard. Our 4 machine learning models — trained on NASA\'s battery cycling research dataset — analyze 17 sensor features in real time to deliver 97%+ accurate predictions. Get CSV batch analysis for bulk fleet assessments, automated email reports, and API access for integrating predictions into your existing fleet management tools.',
    features: ['AI Health Predictor with 97% accuracy', 'Fleet-wide monitoring dashboard', 'Predictive maintenance alerts', 'CSV batch analysis for bulk assessments', 'Automated email reports (daily/weekly)', 'RESTful API access (1,000 calls/month)', 'Historical trend analysis', 'Multi-chemistry support (LFP, NMC, NCA)'],
    specs: [
      { label: 'ML Models', value: '4 (Stress, Health, RUL, Efficiency)' },
      { label: 'Training Data', value: 'NASA Battery Cycling Dataset' },
      { label: 'Accuracy', value: '97%+ across all models' },
      { label: 'API Rate Limit', value: '1,000 calls/month' },
      { label: 'Data Retention', value: '12 months' },
      { label: 'Supported Chemistries', value: 'LFP, NMC, NCA, Lead-Acid' },
    ],
    buyLink: 'https://batteryiq.com/checkout/cloud',
  },
  'batteryiq-pro': {
    name: 'BatteryIQ Pro',
    category: 'Software',
    price: '$799',
    period: '/month',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
    desc: 'Enterprise-grade analytics with unlimited API access and custom ML models.',
    longDesc: 'BatteryIQ Pro takes fleet intelligence to the next level. In addition to everything in BatteryIQ Cloud, Pro unlocks unlimited API access for large-scale integrations, the ability to train custom ML models on your own fleet data for even higher accuracy, and a white-label dashboard you can brand as your own. Ideal for fleet operators managing 100+ vehicles or OEMs looking to embed battery intelligence into their products.',
    features: ['Everything in BatteryIQ Cloud', 'Unlimited API access', 'Custom ML model training on your data', 'White-label dashboard (your branding)', 'Priority support (4-hour SLA)', 'On-premise deployment option', 'Advanced analytics & custom reports', 'Multi-tenant fleet management'],
    specs: [
      { label: 'ML Models', value: 'Standard 4 + Custom trained' },
      { label: 'API Rate Limit', value: 'Unlimited' },
      { label: 'Data Retention', value: 'Unlimited' },
      { label: 'Support SLA', value: '4 hours' },
      { label: 'Deployment', value: 'Cloud or On-premise' },
      { label: 'White-label', value: 'Full customization' },
    ],
    buyLink: 'https://batteryiq.com/checkout/pro',
  },
  'batteryiq-enterprise': {
    name: 'BatteryIQ Enterprise',
    category: 'Software',
    price: 'Custom',
    period: '',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=600&fit=crop',
    desc: 'Fully customized deployment with dedicated infrastructure and SLA guarantees.',
    longDesc: 'BatteryIQ Enterprise is built for organizations that need maximum control, security, and customization. Get a fully isolated infrastructure deployment with 99.99% SLA guarantee, custom integrations with your ERP, telematics, and fleet management platforms, and dedicated integration engineering support. Includes comprehensive team training, onboarding, and 24/7 support.',
    features: ['Everything in BatteryIQ Pro', 'Dedicated isolated infrastructure', '99.99% SLA guarantee', 'Custom ERP/telematics integrations', 'Dedicated integration engineer', 'Comprehensive team training & onboarding', '24/7 premium support', 'Compliance & security certifications'],
    specs: [
      { label: 'Infrastructure', value: 'Dedicated / Isolated' },
      { label: 'SLA', value: '99.99% uptime guarantee' },
      { label: 'Support', value: '24/7 with dedicated engineer' },
      { label: 'Integrations', value: 'Custom-built' },
      { label: 'Compliance', value: 'SOC 2, ISO 27001 ready' },
      { label: 'Deployment', value: 'Private cloud or on-premise' },
    ],
    buyLink: 'https://batteryiq.com/contact-sales',
  },
  'bms-pro-module': {
    name: 'BMS Pro Module',
    category: 'Hardware',
    price: '$4,200',
    period: '/unit',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop',
    desc: 'Advanced Battery Management System with real-time cell monitoring.',
    longDesc: 'The BMS Pro Module is a ruggedized, industrial-grade Battery Management System designed for demanding EV fleet environments. It monitors up to 96 individual cells with integrated thermal sensors, communicates via CAN bus or Ethernet, and streams telemetry data directly to BatteryIQ Cloud for AI-powered analysis. IP67-rated for dust and water resistance, it\'s built to survive the harshest conditions in heavy trucks, buses, and industrial EVs.',
    features: ['96-cell individual monitoring', 'Integrated thermal sensor array', 'CAN bus + Ethernet interfaces', 'Direct BatteryIQ Cloud connectivity', 'IP67 dust & water resistance', '5-year manufacturer warranty', 'Active cell balancing', 'Over-voltage/under-voltage protection'],
    specs: [
      { label: 'Cell Capacity', value: 'Up to 96 cells' },
      { label: 'Interfaces', value: 'CAN 2.0B, Ethernet, RS485' },
      { label: 'Protection Rating', value: 'IP67' },
      { label: 'Operating Temp', value: '-40°C to +85°C' },
      { label: 'Dimensions', value: '220 × 160 × 45 mm' },
      { label: 'Warranty', value: '5 years' },
    ],
    buyLink: 'https://batteryiq.com/shop/bms-pro',
  },
  'sensor-array-kit': {
    name: 'Sensor Array Kit',
    category: 'Hardware',
    price: '$1,800',
    period: '/kit',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=600&fit=crop',
    desc: 'Retrofit sensor package for existing battery packs.',
    longDesc: 'The Sensor Array Kit is designed for fleet operators who want to add intelligent monitoring to their existing battery packs without replacing hardware. It includes 12 precision temperature sensors, an impedance analyzer module, and voltage monitoring circuits — all plug-and-play with no soldering required. Data feeds directly into BatteryIQ Cloud for AI analysis.',
    features: ['12 precision temperature sensors', 'Impedance spectrum analyzer', 'Voltage monitoring circuits', 'Easy plug-and-play retrofit', 'No soldering or modification required', '3-year manufacturer warranty', 'Compatible with LFP, NMC, NCA packs', 'Quick installation (under 2 hours)'],
    specs: [
      { label: 'Temp Sensors', value: '12 × NTC 10K (±0.5°C)' },
      { label: 'Impedance Range', value: '1 mΩ – 100 Ω' },
      { label: 'Voltage Range', value: '0 – 60V per module' },
      { label: 'Installation Time', value: '< 2 hours' },
      { label: 'Compatibility', value: 'LFP, NMC, NCA, Lead-Acid' },
      { label: 'Warranty', value: '3 years' },
    ],
    buyLink: 'https://batteryiq.com/shop/sensor-kit',
  },
  'fleet-gateway': {
    name: 'Fleet Gateway',
    category: 'Hardware',
    price: '$2,400',
    period: '/unit',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop',
    desc: 'Edge computing gateway for fleet-wide data aggregation.',
    longDesc: 'The Fleet Gateway is an edge computing device that sits between your BMS modules and BatteryIQ Cloud. It aggregates telemetry data from up to 50 BMS connections, performs edge processing to reduce bandwidth usage, encrypts all data in transit, and transmits via 4G, WiFi, or Ethernet. OTA firmware updates ensure your gateways are always running the latest software.',
    features: ['Up to 50 simultaneous BMS connections', '4G LTE / WiFi / Ethernet connectivity', 'Edge processing & data compression', 'End-to-end AES-256 encryption', 'Over-the-air firmware updates', 'DIN rail mountable', 'Industrial operating temperature', 'Built-in GPS for fleet tracking'],
    specs: [
      { label: 'BMS Connections', value: 'Up to 50' },
      { label: 'Connectivity', value: '4G LTE, WiFi, Ethernet' },
      { label: 'Encryption', value: 'AES-256' },
      { label: 'Mounting', value: 'DIN rail / wall mount' },
      { label: 'Operating Temp', value: '-30°C to +70°C' },
      { label: 'Power', value: '12–48V DC input' },
    ],
    buyLink: 'https://batteryiq.com/shop/fleet-gateway',
  },
};

export default function ProductDetail() {
  const { productId } = useParams();
  const product = productId ? allProducts[productId] : null;

  if (!product) {
    return (
      <Layout>
        <section className="pt-32 pb-24 text-center">
          <h1 className="text-3xl font-bold text-foreground">Product not found</h1>
          <Link to="/products" className="text-primary mt-4 inline-block">← Back to Products</Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>

          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image */}
              <div className="rounded-2xl overflow-hidden glass cyber-border">
                <img src={product.image} alt={product.name} className="w-full h-80 lg:h-full object-cover" />
              </div>

              {/* Info */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">{product.category}</span>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">{product.name}</h1>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-bold text-gradient">{product.price}</span>
                  <span className="text-muted-foreground">{product.period}</span>
                </div>
                <p className="text-muted-foreground mt-6 leading-relaxed">{product.longDesc}</p>

                <a
                  href={product.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all duration-200 glow-primary"
                >
                  {product.price === 'Custom' ? 'Contact Sales' : 'Buy Now'}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </ScrollReveal>

          {/* Features */}
          <ScrollReveal>
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 glass rounded-xl px-5 py-3.5">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-sm text-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Specs */}
          <ScrollReveal>
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Technical Specifications</h2>
              <div className="glass cyber-border rounded-2xl overflow-hidden">
                {product.specs.map((s, i) => (
                  <div key={s.label} className={`flex justify-between items-center px-6 py-4 ${i < product.specs.length - 1 ? 'border-b border-border/20' : ''}`}>
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <span className="text-sm font-medium text-foreground">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
}
