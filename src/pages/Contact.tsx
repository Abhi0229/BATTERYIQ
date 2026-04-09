import { useState } from 'react';
import Layout from '@/components/Layout';
import ScrollReveal from '@/components/ScrollReveal';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <Layout>
      <section className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Contact</span>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mt-3">
                Get in <span className="text-gradient">Touch</span>
              </h1>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                Have questions about BatteryIQ? We'd love to hear from you.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <ScrollReveal direction="left">
              <div className="glass-strong cyber-border rounded-2xl p-8">
                {sent ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <CheckCircle className="w-16 h-16 text-accent mb-4" />
                    <h3 className="text-xl font-bold text-foreground">Message Sent!</h3>
                    <p className="text-sm text-muted-foreground mt-2">We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all" placeholder="Your name" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all" placeholder="you@company.com" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Subject</label>
                      <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all" placeholder="How can we help?" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                      <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all resize-none" placeholder="Tell us about your fleet and requirements..." />
                    </div>
                    <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all glow-primary flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" /> Send Message
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>

            {/* Info + Map */}
            <ScrollReveal direction="right">
              <div className="space-y-6">
                <div className="glass cyber-border rounded-2xl p-7">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Contact Info</h3>
                  <div className="space-y-4">
                    {[
                      { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'contact@batteryiq.ai' },
                      { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+91 98765 43210' },
                      { icon: <MapPin className="w-5 h-5" />, label: 'Office', value: 'Powai, Mumbai 400076, India' },
                    ].map((c) => (
                      <div key={c.label} className="flex items-start gap-3">
                        <div className="text-primary mt-0.5">{c.icon}</div>
                        <div>
                          <div className="text-xs text-muted-foreground">{c.label}</div>
                          <div className="text-sm text-foreground">{c.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass cyber-border rounded-2xl overflow-hidden" style={{ height: '300px' }}>
                  <iframe
                    title="BatteryIQ Office"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.9379432689714!2d72.90504!3d19.1196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c7c0cc7e09e5%3A0x8a2e61ab4e07a0a7!2sPowai%2C%20Mumbai!5e0!3m2!1sen!2sin!4v1700000000000"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
