import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  { q: 'What is BatteryIQ?', a: 'BatteryIQ is an AI-powered battery health monitoring platform designed for electric vehicle fleets. It uses machine learning models trained on NASA battery research data to predict battery stress, health score, remaining useful life, and efficiency in real-time.' },
  { q: 'How accurate are the predictions?', a: 'Our 4 ML models (stress, health, RUL, efficiency) achieve 97-99% accuracy on test data. They are trained on NASA\'s battery cycling dataset and continuously validated against real-world fleet data.' },
  { q: 'What data inputs are required?', a: 'The AI Health Predictor uses 17 sensor features including cycle count, ambient temperature, depth of discharge, C-rate, internal resistance (Re, Rct), capacity measurements, and derived features like capacity fade and impedance growth ratios.' },
  { q: 'Can I integrate BatteryIQ with my existing fleet management system?', a: 'Yes! Our RESTful API allows seamless integration with any fleet management platform, ERP system, or telematics solution. We support both single and batch predictions in JSON format.' },
  { q: 'What battery chemistries are supported?', a: 'Currently, our models are optimized for LFP (Lithium Iron Phosphate) and NMC (Nickel Manganese Cobalt) chemistries, which cover the majority of EV fleet batteries. NCA support is in development.' },
  { q: 'Is there a free trial?', a: 'Yes, all plans include a 14-day free trial with full access to all features. No credit card required to start.' },
  { q: 'How does predictive maintenance work?', a: 'Our system continuously monitors battery degradation trends and compares them against known failure patterns. When a battery approaches a critical threshold, we automatically generate alerts — for example, "Battery B4 on Truck #12 needs servicing in approximately 14 cycles."' },
  { q: 'What about data security?', a: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are SOC 2 Type II compliant and GDPR ready. Enterprise plans include options for on-premise deployment.' },
  { q: 'Do you offer hardware solutions?', a: 'Yes, we offer the BMS Pro Module ($4,200/unit) for new installations and the Sensor Array Kit ($1,800/kit) for retrofitting existing battery packs. Both integrate seamlessly with our cloud platform.' },
  { q: 'How do I get started?', a: 'Simply sign up for a free trial, connect your battery data source (manual input, CSV upload, or API), and start getting predictions immediately. Our onboarding team will help you set up within 30 minutes.' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass cyber-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-5 text-left group">
        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-primary' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/20 pt-4">{a}</div>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <Layout>
      <section className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</span>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-3">
                Frequently Asked <span className="text-gradient">Questions</span>
              </h1>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <ScrollReveal key={faq.q} delay={i * 50}>
                <FAQItem {...faq} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
