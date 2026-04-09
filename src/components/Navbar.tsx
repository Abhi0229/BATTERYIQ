import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Zap, Monitor, HardDrive, Activity, MapPin, BarChart3, Shield, Cpu, HelpCircle, Users, BookOpen, DollarSign } from 'lucide-react';

interface DropdownItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  desc: string;
}

const productsDropdown: DropdownItem[] = [
  { label: 'Software', href: '/products?tab=software', icon: <Monitor className="w-4 h-4" />, desc: 'AI-powered battery analytics platform' },
  { label: 'Hardware', href: '/products?tab=hardware', icon: <HardDrive className="w-4 h-4" />, desc: 'BMS modules & sensor arrays' },
];

const servicesDropdown: DropdownItem[] = [
  { label: 'AI Health Predictor', href: '/dashboard', icon: <Activity className="w-4 h-4" />, desc: 'Real-time battery diagnostics' },
  { label: 'Fleet Dashboard', href: '/services#fleet', icon: <BarChart3 className="w-4 h-4" />, desc: 'Monitor your entire fleet' },
  { label: 'Locate a Charger', href: '/services#charger', icon: <MapPin className="w-4 h-4" />, desc: 'Find EV charging stations' },
  { label: 'AI Chatbot', href: '/services#assistant', icon: <Cpu className="w-4 h-4" />, desc: 'Intelligent battery assistant' },
];

const companyDropdown: DropdownItem[] = [
  { label: 'About', href: '/about', icon: <Users className="w-4 h-4" />, desc: 'Our mission & team' },
  { label: 'FAQ', href: '/faq', icon: <HelpCircle className="w-4 h-4" />, desc: 'Common questions answered' },
  { label: 'Blogs', href: '/blogs', icon: <BookOpen className="w-4 h-4" />, desc: 'Latest insights & updates' },
  { label: 'Pricing', href: '/pricing', icon: <DollarSign className="w-4 h-4" />, desc: 'Plans that scale with you' },
];

function DropdownMenu({ items, isOpen }: { items: DropdownItem[]; isOpen: boolean }) {
  return (
    <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
      <div className="glass-strong rounded-xl p-2 min-w-[280px] shadow-2xl">
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="flex items-start gap-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-primary/10 group"
          >
            <div className="mt-0.5 text-primary/70 group-hover:text-primary transition-colors">{item.icon}</div>
            <div>
              <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const handleEnter = (name: string) => {
    clearTimeout(timeoutRef.current);
    setActiveDropdown(name);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  const [session, setSession] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const s = localStorage.getItem('batteryiq_session');
    if (s) setSession(JSON.parse(s));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('batteryiq_session');
    setSession(null);
    window.location.href = '/';
  };

  const navItems = [
    { label: 'Products', dropdown: productsDropdown, key: 'products' },
    { label: 'Services', dropdown: servicesDropdown, key: 'services' },
    { label: 'Company', dropdown: companyDropdown, key: 'company' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-strong shadow-lg shadow-background/50' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:glow-primary transition-all duration-300">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Battery<span className="text-primary">IQ</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => handleEnter(item.key)}
                onMouseLeave={handleLeave}
              >
                <button className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${activeDropdown === item.key ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  {item.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === item.key ? 'rotate-180' : ''}`} />
                </button>
                <DropdownMenu items={item.dropdown} isOpen={activeDropdown === item.key} />
              </div>
            ))}
            <Link to="/contact" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {session ? (
              <>
                <Link to="/profile" className="px-4 py-2 text-sm font-bold text-foreground hover:text-primary transition-colors">
                  Profile
                </Link>
                <Link to="/dashboard" className="px-4 py-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-5 py-2.5 text-sm font-semibold bg-white/5 border border-white/10 text-foreground rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-200 glow-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="glass-strong px-4 py-6 space-y-4 border-t border-border/30">
          {navItems.map((item) => (
            <div key={item.key}>
              <div className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">{item.label}</div>
              {item.dropdown.map((sub) => (
                <Link key={sub.label} to={sub.href} className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-primary/5 transition-colors">
                  {sub.icon}
                  {sub.label}
                </Link>
              ))}
            </div>
          ))}
          <Link to="/contact" className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground">Contact</Link>
          <div className="pt-4 border-t border-border/30 flex gap-3">
            <Link to="/login" className="flex-1 text-center py-2.5 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-secondary transition-colors">Log in</Link>
            <Link to="/signup" className="flex-1 text-center py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg">Get Started</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
