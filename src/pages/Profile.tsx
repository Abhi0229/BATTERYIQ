import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { User, Mail, ShieldAlert, Cpu, LogOut, FileText, ArrowLeft, Activity, BarChart3 } from 'lucide-react';
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
          <div className="flex justify-between items-center mb-10">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded-full transition-all border border-red-400/10"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>

          <div className="glass-strong rounded-[2.5rem] p-10 md:p-14 border border-white/10 relative shadow-2xl overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
             
             <div className="relative z-10">
                <div className="flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left mb-12">
                   <div className="relative">
                      <div className="w-36 h-36 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-white/5 flex items-center justify-center shadow-inner">
                        <User className="w-20 h-20 text-primary" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-[#00d97e] p-2 rounded-full border-4 border-[#020617] shadow-lg">
                        <ShieldAlert className="w-4 h-4 text-[#020617]" />
                      </div>
                   </div>

                   <div className="flex-1 space-y-4">
                      <div>
                        <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">{session.name}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                                {session.role} LEVEL
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-400">
                                UID: {Math.floor(Math.random() * 90000) + 10000}
                            </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 text-sm">
                        <Mail className="w-4 h-4 text-primary/70" /> {session.email}
                      </p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Diagnostics Health</h3>
                        <div className="flex items-end justify-between">
                            <div className="space-y-1">
                                <span className="text-3xl font-bold text-foreground">Verified</span>
                                <p className="text-[10px] text-green-500 font-bold">ACTIVE SUBSCRIPTION</p>
                            </div>
                            <Activity className="w-8 h-8 text-primary/20 group-hover:text-primary/50 transition-colors" />
                        </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group text-right md:text-left">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">ML Fleet Insights</h3>
                        <div className="flex items-end justify-between flex-row-reverse md:flex-row">
                             <BarChart3 className="w-8 h-8 text-primary/20 group-hover:text-primary/50 transition-colors" />
                            <div className="space-y-1">
                                <span className="text-3xl font-bold text-foreground">Premium</span>
                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Enterprise API Enabled</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-white/10">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold">Reporting Hub</h3>
                      <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase bg-white/5 px-3 py-1 rounded-full">Automated Generation</span>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                      <a 
                        href="/api/export_pdf" 
                        target="_blank"
                        className="p-8 rounded-3xl bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center gap-4 text-center group shadow-xl shadow-primary/20"
                      >
                         <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                            <FileText className="w-8 h-8 fill-current" />
                         </div>
                         <div>
                            <p className="font-bold text-xl mb-1">Download Comprehensive AI Report</p>
                            <p className="text-xs opacity-80 max-w-xs mx-auto">Export your full battery lifecycle data, efficiency trends, and predictive risk factors in a high-fidelity PDF.</p>
                         </div>
                      </a>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
