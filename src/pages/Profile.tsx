import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { User, Mail, ShieldAlert, Cpu, LogOut, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [session, setSession] = useState<{name: string, email: string, role: string} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const s = localStorage.getItem('batteryiq_session');
    if (!s) {
      navigate('/login');
    } else {
      setSession(JSON.parse(s));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('batteryiq_session');
    navigate('/');
  };

  if (!session) return null;

  return (
    <Layout>
      <div className="pt-32 pb-24 min-h-screen relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <div className="glass-strong rounded-3xl p-8 md:p-12 border border-white/10 relative">
            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider glow-primary">
              Active Session
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-start">
              {/* Avatar Section */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mb-6">
                  <User className="w-16 h-16 text-primary" />
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-8 w-full">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{session.name}</h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {session.role === 'driver' ? <ShieldAlert className="w-3.5 h-3.5 text-blue-500" /> : <Cpu className="w-3.5 h-3.5 text-green-500" />}
                    {session.role} Account
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-card p-4 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Email Address</p>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" /> {session.email}
                    </p>
                  </div>
                  <div className="glass-card p-4 rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Account ID</p>
                    <p className="text-sm font-medium font-mono text-muted-foreground">USRID-{Math.floor(Math.random() * 90000) + 10000}</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link to="/dashboard" className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all group flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Cpu className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm group-hover:text-primary transition-colors">My Dashboard</p>
                        <p className="text-xs text-muted-foreground">View real-time battery analytics</p>
                      </div>
                    </Link>
                    <a href="/api/export_pdf" className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all group flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-sm group-hover:text-primary transition-colors">Download Report</p>
                        <p className="text-xs text-muted-foreground">Export full PDF prediction history</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
