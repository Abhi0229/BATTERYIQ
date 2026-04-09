import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { User, Mail, ShieldAlert, Cpu, LogOut, FileText, ArrowLeft, Settings, Save, X, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function Profile() {
  const [session, setSession] = useState<{name: string, email: string, role: string} | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    current_password: '',
    new_password: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const s = localStorage.getItem('batteryiq_session');
    if (!s) {
      navigate('/login');
    } else {
      const data = JSON.parse(s);
      setSession(data);
      setFormData(prev => ({ ...prev, name: data.name, email: data.email }));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('batteryiq_session');
    navigate('/');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.current_password) {
      toast.error("Current password is required to save changes.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Profile updated successfully!');
        const updatedSession = { ...data.user };
        localStorage.setItem('batteryiq_session', JSON.stringify(updatedSession));
        setSession(updatedSession);
        setIsEditing(false);
        setFormData(prev => ({ ...prev, current_password: '', new_password: '' }));
      } else {
        toast.error(data.error || 'Update failed');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider glow-primary shadow-xl">
              Active Session
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-start">
              {/* Avatar Section */}
              <div className="flex flex-col items-center shrink-0 w-full md:w-auto">
                <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mb-6 relative group">
                  <User className="w-16 h-16 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />
                </div>
                
                <div className="flex flex-col gap-2 w-full max-w-[160px]">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all border ${
                      isEditing 
                      ? 'bg-white/5 border-white/10 text-muted-foreground hover:text-foreground' 
                      : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
                    }`}
                  >
                    {isEditing ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Settings className="w-3.5 h-3.5" /> Edit Profile</>}
                  </button>
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors border border-red-500/20"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>

              {/* Info Section / Form */}
              <div className="flex-1 space-y-8 w-full">
                {!isEditing ? (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-foreground mb-2">{session.name}</h1>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
                        {session.role === 'driver' ? <ShieldAlert className="w-3.5 h-3.5 text-blue-500" /> : <Cpu className="w-3.5 h-3.5 text-green-500" />}
                        {session.role} Account
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="glass-card p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-2 opacity-60 text-primary">Email Address</p>
                        <p className="text-sm font-bold flex items-center gap-2 text-foreground/90">
                          <Mail className="w-4 h-4 text-primary" /> {session.email}
                        </p>
                      </div>
                      <div className="glass-card p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black mb-2 opacity-60 text-primary">Account ID</p>
                        <p className="text-sm font-bold font-mono text-muted-foreground/80">USRID-{Math.floor(Math.random() * 90000) + 10000}</p>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                      <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-foreground/40">Quick Actions</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/dashboard" className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/40 transition-all group flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <Cpu className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground transition-colors group-hover:text-primary">Dashboard</p>
                            <p className="text-[10px] text-muted-foreground">View real-time battery analytics</p>
                          </div>
                        </Link>
                        <Link to="/history" className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/40 transition-all group flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground transition-colors group-hover:text-primary">History Reports</p>
                            <p className="text-[10px] text-muted-foreground">Export full CSV/PDF history</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdate} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div>
                      <h2 className="text-xl font-bold mb-1">Edit Account Details</h2>
                      <p className="text-xs text-muted-foreground">Update your personal information and credentials.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                          <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                          <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 space-y-4">
                      <div className="flex items-center gap-2 text-yellow-500">
                        <Lock className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Security Verification</span>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Current Password *</label>
                        <input 
                          type="password" 
                          required
                          placeholder="Required to confirm changes"
                          value={formData.current_password}
                          onChange={(e) => setFormData({...formData, current_password: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>

                      <div className="space-y-2 pt-2 border-t border-yellow-500/10">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">New Password (Optional)</label>
                        <input 
                          type="password" 
                          placeholder="Minimum 6 characters"
                          minLength={6}
                          value={formData.new_password}
                          onChange={(e) => setFormData({...formData, new_password: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all glow-primary disabled:opacity-50"
                      >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 border border-white/10 rounded-xl font-bold text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
