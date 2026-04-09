import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Zap, Eye, EyeOff, ArrowLeft, ShieldCheck, Activity, Battery } from 'lucide-react';

const LIVE_PREVIEWS = [
  { id: 'B0005', health: 94, stress: 'Low',   color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
  { id: 'B0006', health: 78, stress: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  { id: 'B0007', health: 62, stress: 'High',   color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20' },
];

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem('batteryiq_session')) navigate('/dashboard');
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);

    try {
      const res  = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('batteryiq_session', JSON.stringify(data.user));
        const redirect = params.get('redirect');
        navigate(redirect ? `/${redirect}` : '/dashboard');
      } else {
        setError(data.error || 'Invalid email or password.');
      }
    } catch {
      setError('Cannot reach server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex gradient-bg">
      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-center items-center w-[45%] px-12 relative overflow-hidden border-r border-white/5">
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-0" />
        <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px] -z-0" />

        <div className="relative z-10 text-center max-w-sm">
          {/* Brand */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center glow-primary">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <span className="text-2xl font-bold">Battery<span className="text-primary">IQ</span></span>
          </div>

          <h2 className="text-3xl font-bold mb-3 leading-tight">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-8">Your battery intelligence dashboard is waiting.</p>

          {/* Live battery previews */}
          <div className="space-y-3 mb-8 text-left">
            {LIVE_PREVIEWS.map((b) => (
              <div key={b.id} className={`flex items-center gap-3 p-3 rounded-xl border ${b.bg} backdrop-blur`}>
                <Battery className={`w-5 h-5 ${b.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground">Battery {b.id}</p>
                  <p className="text-[10px] text-muted-foreground">Health: {b.health}/100 · Stress: {b.stress}</p>
                </div>
                <span className={`text-xs font-bold ${b.color}`}>{b.health}%</span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex justify-center gap-8 pt-6 border-t border-white/10">
            {[['97%','Accuracy'],['4','AI Models'],['NASA','Dataset']].map(([val, lbl]) => (
              <div key={lbl} className="text-center">
                <div className="text-xl font-bold text-primary font-mono">{val}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 relative">
        <div className="absolute inset-0 gradient-radial opacity-40" />
        <div className="w-full max-w-md relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="glass-strong rounded-2xl p-8 border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="mb-7">
              <div className="flex items-center gap-2 lg:hidden mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-foreground">BatteryIQ</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
              <p className="text-sm text-muted-foreground mt-1">Access your battery monitoring dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 bg-muted/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 glow-primary disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                ) : (
                  <><Activity className="w-4 h-4" /> Sign In to BatteryIQ</>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-semibold">Create one free →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
