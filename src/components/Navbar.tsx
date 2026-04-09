import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, ChevronDown, Zap, Monitor, HardDrive, Activity, 
  MapPin, BarChart3, Cpu, HelpCircle, Users, BookOpen, 
  DollarSign, Car, Wrench, LogOut, LayoutDashboard, UserCircle 
} from 'lucide-react';

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
  { label: 'Fleet Dashboard', href: '/dashboard', icon: <BarChart3 className="w-4 h-4" />, desc: 'Monitor your entire fleet' },
  { label: 'Locate a Charger', href: '/map', icon: <MapPin className="w-4 h-4" />, desc: 'Find EV charging stations near you' },
  { label: 'AI Chatbot', href: '/services#assistant', icon: <Cpu className="w-4 h-4" />, desc: 'Intelligent battery assistant' },
  { label: 'History', href: '/history', icon: <BarChart3 className="w-4 h-4" />, desc: 'Your past predictions & analytics' },
];

const companyDropdown: DropdownItem[] = [
  { label: 'About', href: '/about', icon: <Users className="w-4 h-4" />, desc: 'Our mission & team' },
  { label: 'FAQ', href: '/faq', icon: <HelpCircle className="w-4 h-4" />, desc: 'Common questions answered' },
  { label: 'Blogs', href: '/blogs', icon: <BookOpen className="w-4 h-4" />, desc: 'Latest insights & updates' },
  { label: 'Pricing', href: '/pricing', icon: <DollarSign className="w-4 h-4" />, desc: 'Plans that scale with you' },
];

function DropdownMenu({ items, isOpen }: { items: DropdownItem[]; isOpen: boolean }) {
  return (
    <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ease-out ${isOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
      <div className="glass-strong rounded-2xl p-2 min-w-[300px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-white/5">
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="flex items-start gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 hover:bg-white/5 group active:scale-[0.98]"
          >
            <div className="mt-1 p-2 bg-white/5 rounded-lg text-primary/70 group-hover:text-primary group-hover:bg-primary/10 transition-all border border-transparent group-hover:border-primary/20">
              {item.icon}
            </div>
            <div>
              <div className="text-sm font-bold text-white/90 group-hover:text-white transition-colors">{item.label}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</div>
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
  const location   = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [session,  setSession]  = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
    const s = localStorage.getItem('batteryiq_session');
    setSession(s ? JSON.parse(s) : null);
  }, [location]);

  const handleEnter = (name: string) => { clearTimeout(timeoutRef.current); setActiveDropdown(name); };
  const handleLeave = () => { timeoutRef.current = setTimeout(() => setActiveDropdown(null), 200); };

  const handleLogout = async () => {
    try { await fetch('/api/logout', { method: 'POST' }); } catch { /* ignore */ }
    localStorage.removeItem('batteryiq_session');
    setSession(null);
    window.location.href = '/';
  };

  const navItems = [
    { label: 'Products', dropdown: productsDropdown, key: 'products' },
    { label: 'Services', dropdown: servicesDropdown, key: 'services' },
    { label: 'Company',  dropdown: companyDropdown,  key: 'company'  },
  ];

  const roleIcon = session?.role === 'driver' ? <Car className="w-3.5 h-3.5" /> : <Wrench className="w-3.5 h-3.5" />;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${scrolled ? 'scale-95' : 'scale-100'}`}>
        <div className={`glass-strong rounded-[32px] border border-white/10 shadow-2xl transition-all duration-500 px-6 lg:px-10 ${scrolled ? 'bg-[#020617]/90 backdrop-blur-2xl' : 'bg-[#020617]/40 backdrop-blur-md'} overflow-visible`}>
          <div className="flex items-center justify-between h-16 lg:h-18">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:glow-primary transition-all duration-300 border border-primary/20">
                <Zap className="w-5 h-5 text-primary fill-primary/20" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">Battery<span className="text-primary italic">IQ</span></span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1.5 ml-8">
              {navItems.map((item) => (
                <div key={item.key} className="relative" onMouseEnter={() => handleEnter(item.key)} onMouseLeave={handleLeave}>
                  <button className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-bold rounded-xl transition-all duration-200 ${activeDropdown === item.key ? 'text-primary bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === item.key ? 'rotate-180 text-primary' : 'opacity-40'}`} />
                  </button>
                  <DropdownMenu items={item.dropdown} isOpen={activeDropdown === item.key} />
                </div>
              ))}
              <Link to="/contact" className="px-4 py-2.5 text-[13px] font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                Contact
              </Link>
            </div>

            {/* Desktop User / CTA Area */}
            <div className="hidden lg:flex items-center gap-5 ml-auto pl-8 border-l border-white/10">
              {session ? (
                <>
                  <div className="flex items-center gap-4">
                    {/* Unique Role Badge */}
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] group">
                      <span className="text-primary animate-pulse">{roleIcon}</span>
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{session.role}</span>
                    </div>

                    <Link to="/profile" className="flex items-center gap-2.5 group">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-all">
                         <UserCircle className="w-5 h-5 text-white/40 group-hover:text-primary transition-all" />
                      </div>
                      <span className="text-[13px] font-bold text-white/80 group-hover:text-white transition-colors">
                        {session.name.split(' ')[0]}
                      </span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/10 active:scale-95 group"
                    >
                      <LayoutDashboard className="w-4 h-4 group-hover:animate-bounce" />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="p-2.5 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white/40 hover:text-red-500 rounded-xl transition-all active:scale-90 group"
                      title="Terminate Session"
                    >
                      <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-[13px] font-bold text-white/60 hover:text-white transition-colors">
                    Log in
                  </Link>
                  <Link to="/signup" className="px-6 py-3 bg-primary text-white text-[13px] font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(59,130,246,0.3)] glow-primary">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white/80 border border-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop & Sidebar */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 z-[-1] ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setMobileOpen(false)}
      />
      <div className={`fixed top-0 bottom-0 right-0 w-[80%] max-w-sm glass-strong lg:hidden transform transition-transform duration-500 ease-elastic z-[-1] ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-20 px-6 pb-8">
           <div className="flex-1 overflow-y-auto space-y-8 py-6 custom-scrollbar">
              {navItems.map((item) => (
                <div key={item.key} className="space-y-4">
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{item.label}</div>
                  <div className="grid grid-cols-1 gap-1">
                    {item.dropdown.map((sub) => (
                      <Link key={sub.label} to={sub.href} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all group">
                        <div className="p-2 bg-white/5 rounded-xl text-primary/60 group-hover:text-primary transition-all">{sub.icon}</div>
                        <div className="text-sm font-bold text-white/70 group-hover:text-white">{sub.label}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="h-px bg-white/5" />
              <Link to="/contact" className="block text-sm font-bold text-white/70 hover:text-white px-3">Contact Presence</Link>
           </div>

           <div className="pt-8 border-t border-white/10 space-y-4">
             {session ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <UserCircle className="w-6 h-6 text-primary" />
                    <div>
                      <div className="text-sm font-bold text-white uppercase tracking-tight">{session.name}</div>
                      <div className="text-[10px] text-primary font-black uppercase tracking-wider">{session.role} Mode</div>
                    </div>
                  </div>
                  <Link to="/dashboard" className="block w-full text-center py-4 bg-primary text-white text-sm font-black rounded-2xl shadow-xl shadow-primary/20">ACCESS DASHBOARD</Link>
                  <button onClick={handleLogout} className="w-full py-4 border border-white/10 text-red-400 text-sm font-bold rounded-2xl hover:bg-red-500/10 transition-all">TERMINATE SESSION</button>
                </div>
             ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" className="py-4 text-center text-sm font-bold text-white/50 border border-white/10 rounded-2xl hover:bg-white/5">LOGIN</Link>
                  <Link to="/signup" className="py-4 text-center text-sm font-black bg-primary text-white rounded-2xl">JOIN NOW</Link>
                </div>
             )}
           </div>
        </div>
      </div>
    </nav>
  );
}
