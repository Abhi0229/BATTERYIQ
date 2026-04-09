import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-radial" />
      <div className="max-w-4xl mx-auto px-4 text-center relative">
        <ScrollReveal>
          <div className="glass cyber-border rounded-3xl p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 relative">
              Ready to <span className="text-gradient">Electrify</span> Your Fleet?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto relative">
              Join thousands of fleet operators who trust BatteryIQ to keep their vehicles running at peak performance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
              <Link
                to="/signup"
                className="group px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all duration-300 glow-primary flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3.5 font-semibold rounded-xl border border-border/50 text-foreground hover:bg-secondary/50 transition-all duration-300"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
