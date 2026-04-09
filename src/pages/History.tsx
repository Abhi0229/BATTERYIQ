import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { History, FileText, Zap, Activity, ShieldAlert, TrendingUp, Download, RefreshCw, Filter } from 'lucide-react';

interface HistoryEntry {
  id: number;
  timestamp: string;
  stress: 'Low' | 'Medium' | 'High';
  health: number;
  rul: number;
  efficiency: number;
  role: string;
}

const STRESS_STYLE: Record<string, string> = {
  Low:    'bg-green-500/10  text-green-400  border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  High:   'bg-red-500/10    text-red-400    border-red-500/20',
};

export default function HistoryPage() {
  const navigate   = useNavigate();
  const [session,  setSession]  = useState<any>(null);
  const [history,  setHistory]  = useState<HistoryEntry[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    const s = localStorage.getItem('batteryiq_session');
    if (!s) { navigate('/login?redirect=history'); return; }
    setSession(JSON.parse(s));
  }, [navigate]);

  const loadHistory = () => {
    setLoading(true);
    fetch('/api/history')
      .then(r => r.json())
      .then(data => {
        if (data.success) setHistory(data.history);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { if (session) loadHistory(); }, [session]);

  const filtered = history.filter(h =>
    (filter === 'All' || h.stress === filter) &&
    (search === '' || h.timestamp.toLowerCase().includes(search.toLowerCase()))
  );

  // Aggregate stats
  const avgHealth = history.length ? (history.reduce((s, h) => s + h.health, 0) / history.length).toFixed(1) : '—';
  const avgRUL    = history.length ? Math.round(history.reduce((s, h) => s + h.rul, 0) / history.length) : '—';
  const highRisk  = history.filter(h => h.stress === 'High').length;

  if (!session) return null;

  return (
    <Layout>
      <div className="container py-10 pt-24 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History className="w-5 h-5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Prediction History</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Your Analysis Logs</h1>
            <p className="text-muted-foreground text-sm mt-1">All past battery diagnostics and AI predictions for your account.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadHistory} className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all">
              <RefreshCw className={`w-4 h-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
            </button>
            <a href="/api/export_pdf" className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 border border-primary/20 text-primary rounded-xl text-sm font-bold hover:bg-primary/20 transition-all">
              <Download className="w-4 h-4" /> Export All PDF
            </a>
            <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all glow-primary">
              <Zap className="w-4 h-4" /> New Analysis
            </Link>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Analyses', value: history.length, icon: <History className="w-5 h-5 text-primary" />, color: 'bg-primary/10' },
            { label: 'Avg Health Score', value: `${avgHealth}%`, icon: <Activity className="w-5 h-5 text-green-400" />, color: 'bg-green-500/10' },
            { label: 'Avg Cycles Left', value: avgRUL, icon: <TrendingUp className="w-5 h-5 text-blue-400" />, color: 'bg-blue-500/10' },
            { label: 'High Risk Alerts', value: highRisk, icon: <ShieldAlert className="w-5 h-5 text-red-400" />, color: 'bg-red-500/10' },
          ].map(c => (
            <div key={c.label} className="glass-card p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${c.color} flex items-center justify-center flex-shrink-0`}>{c.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wide">{c.label}</p>
                <p className="text-xl font-bold text-foreground mt-0.5">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-5">
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {(['All','Low','Medium','High'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${filter === f ? 'bg-primary/20 border-primary/40 text-primary' : 'border-white/10 text-muted-foreground hover:border-white/20'}`}>
                {f}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by date…"
            className="px-4 py-2 text-sm bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground w-full sm:w-56 transition-all"
          />
        </div>

        {/* Table */}
        <div className="glass-strong rounded-2xl overflow-hidden border border-white/10">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Loading history…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <History className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-foreground font-semibold mb-1">No records found</p>
              <p className="text-sm text-muted-foreground mb-6">Run a battery analysis to see your history here.</p>
              <Link to="/dashboard" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all glow-primary">
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs uppercase text-muted-foreground bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-5 py-4 font-semibold">#</th>
                    <th className="px-5 py-4 font-semibold">Timestamp</th>
                    <th className="px-5 py-4 font-semibold text-center">Stress</th>
                    <th className="px-5 py-4 font-semibold text-center">Health</th>
                    <th className="px-5 py-4 font-semibold text-center">RUL</th>
                    <th className="px-5 py-4 font-semibold text-center">Efficiency</th>
                    <th className="px-5 py-4 font-semibold text-center">Export</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((h, i) => (
                    <tr key={h.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-5 py-4 text-muted-foreground text-xs font-mono">{i + 1}</td>
                      <td className="px-5 py-4 text-sm font-mono text-foreground/80">{h.timestamp}</td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${STRESS_STYLE[h.stress]}`}>
                          {h.stress}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`font-bold text-sm ${h.health >= 80 ? 'text-green-400' : h.health >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>{h.health}%</span>
                          <div className="w-16 h-1 bg-white/10 rounded-full mt-1">
                            <div className={`h-full rounded-full ${h.health >= 80 ? 'bg-green-400' : h.health >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${h.health}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center text-sm text-muted-foreground">{h.rul} <span className="text-xs">cycles</span></td>
                      <td className="px-5 py-4 text-center text-sm text-foreground">{h.efficiency ?? '—'}%</td>
                      <td className="px-5 py-4 text-center">
                        <a href={`/api/export_pdf/${h.id}`}
                          className="inline-flex items-center justify-center p-2 rounded-lg border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all group-hover:border-primary/20">
                          <FileText className="w-4 h-4 text-primary" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            Showing {filtered.length} of {history.length} record{history.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </Layout>
  );
}
