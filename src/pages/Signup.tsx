import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, ArrowLeft, Car, Wrench, CheckCircle, ShieldCheck, Activity } from 'lucide-react';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(password) },
    { label: 'Number or symbol', ok: /[\d!@#$%^&*]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-2">
        {[0,1,2,3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score-1] : 'bg-white/10'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-muted-foreground">Password strength</span>
        <span className={`text-[10px] font-bold ${score < 2 ? 'text-red-400' : score < 3 ? 'text-yellow-400' : 'text-green-400'}`}>
          {labels[score - 1] || 'Weak'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        {checks.map(c => (
          <div key={c.label} className={`flex items-center gap-1 text-[10px] transition-colors ${c.ok ? 'text-green-400' : 'text-muted-foreground'}`}>
            <CheckCircle className={`w-2.5 h-2.5 flex-shrink-0 ${c.ok ? 'opacity-100' : 'opacity-30'}`} />
            {c.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Signup() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState<'driver' | 'technician'>('driver');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('batteryiq_session')) navigate('/dashboard');
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('Please fill in all fields.'); return; }
    if (password.length < 8)          { setError('Password must be at least 8 characters.'); return; }
    if (!/[A-Z]/.test(password))      { setError('Password needs at least one uppercase letter.'); return; }
    if (!/[a-z]/.test(password))      { setError('Password needs at least one lowercase letter.'); return; }
    if (!/[\d!@#$%^&*]/.test(password)) { setError('Password needs a number or symbol (!@#$%^&*).'); return; }

    setLoading(true);
    try {
      const res  = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('batteryiq_session', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.error || 'Signup failed. Please try again.');
      }
    } catch {
      setError('Cannot reach server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      key: 'driver' as const,
      icon: <Car className="w-7 h-7" />,
      label: 'Driver',
      desc: 'Monitor your EV battery health, get trip insights and personalized tips.',
      features: ['Battery health check', 'Trip analysis', 'Smart tips', 'History logs'],
    },
    {
      key: 'technician' as const,
      icon: <Wrench className="w-7 h-7" />,
      label: 'Technician',
      desc: 'Full diagnostic access — batch CSV analysis, fleet management & PDF exports.',
      features: ['17-sensor diagnostics', 'Batch CSV upload', 'Fleet overview', 'PDF reports'],
    },
  ] as const;

  return (
    <div className="min-h-screen flex gradient-bg">
      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-center items-center w-[45%] px-12 relative overflow-hidden border-r border-white/5">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-0" />
        <div className="absolute bottom-1/4 right-0 w-56 h-56 bg-blue-500/10 rounded-full blur-[80px] -z-0" />

        <div className="relative z-10 text-center max-w-sm w-full">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center glow-primary">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <span className="text-2xl font-bold">Battery<span className="text-primary">IQ</span></span>
          </div>

          <h2 className="text-3xl font-bold mb-3">Join BatteryIQ</h2>
          <p className="text-muted-foreground text-sm mb-8">Choose your role and get started with AI-powered battery intelligence.</p>

          {/* Role preview cards */}
          <div className="space-y-4 text-left">
            {roles.map(r => (
              <div key={r.key} className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${role === r.key ? 'border-primary/50 bg-primary/10' : 'border-white/10 bg-white/5 opacity-60'}`}
                   onClick={() => setRole(r.key)}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${role === r.key ? 'bg-primary/20 text-primary' : 'bg-white/10 text-muted-foreground'}`}>
                    {r.icon}
                  </div>
                  <span className="font-bold text-foreground">{r.label}</span>
                  {role === r.key && <CheckCircle className="w-4 h-4 text-primary ml-auto" />}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{r.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {r.features.map(f => (
                    <span key={f} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground">{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 relative overflow-y-auto">
        <div className="absolute inset-0 gradient-radial opacity-40" />
        <div className="w-full max-w-md relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="glass-strong rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="mb-7">
              <div className="flex items-center gap-2 lg:hidden mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <span className="font-bold text-foreground">BatteryIQ</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
              <p className="text-sm text-muted-foreground mt-1">Start your free battery intelligence journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all"
                  placeholder="Alex Johnson"
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
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
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 bg-muted/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/15 transition-all"
                    placeholder="Min 8 characters"
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              {/* Role selector (mobile only — desktop uses left panel) */}
              <div className="lg:hidden">
                <label className="text-sm font-medium text-foreground mb-2 block">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map(r => (
                    <button key={r.key} type="button" onClick={() => setRole(r.key)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-semibold transition-all duration-200 ${role === r.key ? 'border-primary/60 bg-primary/10 text-primary' : 'border-border/50 text-muted-foreground hover:border-primary/30'}`}>
                      {r.icon}
                      {r.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Role: <span className="text-primary font-semibold capitalize">{role}</span>
                </p>
              </div>

              {/* Selected role indicator (desktop) */}
              <div className="hidden lg:flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20">
                {role === 'driver' ? <Car className="w-4 h-4 text-primary" /> : <Wrench className="w-4 h-4 text-primary" />}
                <span className="text-sm text-foreground">Signing up as <span className="text-primary font-bold capitalize">{role}</span></span>
                <button type="button" onClick={() => setRole(role === 'driver' ? 'technician' : 'driver')}
                  className="ml-auto text-xs text-muted-foreground hover:text-primary underline transition-colors">
                  Switch role
                </button>
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
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                ) : (
                  <><Activity className="w-4 h-4" /> Create Account</>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-semibold">Sign in →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
