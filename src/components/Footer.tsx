import { Link } from 'react-router-dom';
import { Zap, Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  Products: [
    { label: 'Software Platform', href: '/products?tab=software' },
    { label: 'BMS Hardware', href: '/products?tab=hardware' },
    { label: 'Technical Specs', href: '/products?tab=software' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Services: [
    { label: 'AI Health Predictor', href: '/services#predictor' },
    { label: 'Fleet Dashboard', href: '/services#fleet' },
    { label: 'Charger Locator', href: '/services#charger' },
    { label: 'Predictive Maintenance', href: '/services#maintenance' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blogs' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border/30 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">Battery<span className="text-primary">IQ</span></span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              AI-powered battery intelligence platform for electric fleets. Predict, monitor, and optimize.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary/70" /> contact@batteryiq.ai</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary/70" /> +91 98765 43210</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary/70" /> Mumbai, India</div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BatteryIQ. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
