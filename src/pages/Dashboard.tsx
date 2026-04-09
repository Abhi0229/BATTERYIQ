import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Zap, Activity, Battery, ShieldAlert, Cpu, History, FileText, MapPin, BarChart3, Upload } from 'lucide-react';

export default function Dashboard() {
  const [session, setSession] = useState<{name: string, email: string, role: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const s = localStorage.getItem('batteryiq_session');
    if (!s) {
      navigate('/login');
    } else {
      setSession(JSON.parse(s));
    }
    setLoading(false);
  }, [navigate]);

  if (loading || !session) return null;

  return (
    <Layout>
      <div className="container py-8">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full border border-primary/20 uppercase tracking-wider">
              {session.role} DASHBOARD
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Welcome, {session.name}</h1>
          <p className="text-muted-foreground">Monitor and analyze EV battery status in real-time.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold">System Status</p>
              <p className="font-bold text-foreground">Operational</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold">AI Models</p>
              <p className="font-bold text-foreground">4 Active</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold">Latency</p>
              <p className="font-bold text-foreground">24ms</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Battery className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold">Health Score</p>
              <p className="font-bold text-foreground">92% Avg</p>
            </div>
          </div>
        </div>

        {session.role === 'driver' ? <DriverView /> : <TechnicianView />}
      </div>
    </Layout>
  );
}

function DriverView() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [params, setParams] = useState({
    battery_pct: 80,
    temperature: 30,
    cycle_count: 50,
    trip_duration: 45
  });
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/predict/driver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...params,
          trip_duration: params.trip_duration * 60,
          ambient_temp: 24
        })
      });
      const data = await resp.json();
      if (data.success) {
        setResults(data);
      }
    } catch (err) {
      console.error('Analysis failed', err);
    } finally {
      setLoading(false);
    }
  };

  const getTips = (data: any) => {
    const tips = [];
    if (data.health_score < 75) tips.push({ icon: "🔧", text: "Schedule a battery checkup at your service center soon." });
    if (data.stress_label === 'High') tips.push({ icon: "🌡️", text: "Avoid rapid acceleration — it increases battery stress significantly." });
    if (data.RUL < 30) tips.push({ icon: "⚠️", text: `Only ${data.RUL} cycles left — start planning for replacement.` });
    if (data.health_score > 85) tips.push({ icon: "✅", text: "Great battery health! Keep up your current charging habits." });
    return tips.slice(0, 4);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-muted/30 rounded-xl w-fit mb-6">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted text-muted-foreground'}`}
        >
          Diagnosis
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted text-muted-foreground'}`}
        >
          My History
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            <div className="glass-strong rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                <Zap className="text-primary w-5 h-5" /> Battery Parameters
              </h3>
              <p className="text-xs text-muted-foreground mb-6">Adjust sliders to match your instrument cluster readings.</p>
              
              <div className="space-y-6">
                <SliderField 
                  label="Battery Level" 
                  value={params.battery_pct} 
                  min={10} max={100} unit="%"
                  onChange={(v: number) => setParams({...params, battery_pct: v})} 
                />
                <SliderField 
                  label="Temperature" 
                  value={params.temperature} 
                  min={5} max={65} unit="°C"
                  onChange={(v: number) => setParams({...params, temperature: v})} 
                />
                <SliderField 
                  label="Charge Cycles" 
                  value={params.cycle_count} 
                  min={1} max={500} unit=""
                  onChange={(v: number) => setParams({...params, cycle_count: v})} 
                />
                <SliderField 
                  label="Trip Duration" 
                  value={params.trip_duration} 
                  min={5} max={180} unit=" min"
                  onChange={(v: number) => setParams({...params, trip_duration: v})} 
                />

                <button 
                  onClick={analyze}
                  disabled={loading}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all glow-primary disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Analyze My Battery
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="glass-card p-6 flex items-center gap-6">
              <div className="relative w-16 h-28 border-2 border-muted-foreground/30 rounded-lg p-1">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-2 bg-muted-foreground/30 rounded-t-sm" />
                <div 
                  className="w-full bg-primary transition-all duration-500 rounded-sm" 
                  style={{ 
                    height: `${params.battery_pct}%`, 
                    marginTop: `${100 - params.battery_pct}%`,
                    background: params.battery_pct < 30 ? '#ef4444' : params.battery_pct < 60 ? '#f59e0b' : '#00d97e'
                  }} 
                />
              </div>
              <div>
                <h4 className="font-bold mb-1 text-primary">Battery Viz</h4>
                <p className="text-sm text-muted-foreground">Visualizing current SOC based on input.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-12 xl:col-span-7">
            {results ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div className={`p-6 rounded-2xl flex items-start gap-4 border ${
                  results.driver_summary.color === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                  results.driver_summary.color === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                  'bg-red-500/10 border-red-500/20 text-red-500'
                }`}>
                  <div className="text-3xl">
                    {results.driver_summary.color === 'success' ? '✅' : results.driver_summary.color === 'warning' ? '⚠️' : '🚨'}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{results.driver_summary.title}</h4>
                    <p className="text-sm opacity-90">{results.driver_summary.message}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResultCard 
                    label="Health Score" 
                    value={results.health_score} 
                    status={results.health_info.status} 
                    color={results.health_info.color}
                    unit="/100"
                  />
                  <ResultCard 
                    label="Stress Level" 
                    value={results.stress_label} 
                    status={results.stress_info.message} 
                    color={results.stress_info.color}
                  />
                  <ResultCard 
                    label="Cycles Remaining" 
                    value={results.RUL} 
                    status={results.rul_info.status} 
                    color={results.rul_info.color}
                    unit=" cycles"
                  />
                  <ResultCard 
                    label="Efficiency" 
                    value={results.efficiency_score} 
                    status={results.efficiency_info.status} 
                    color={results.efficiency_info.color}
                    unit="%"
                  />
                </div>
                
                <div className="glass-strong rounded-2xl p-6">
                  <h4 className="font-bold flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-primary" /> Smart Tips
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getTips(results).map((tip, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-lg bg-white/5 border border-white/5 items-start">
                        <span className="text-lg">{tip.icon}</span>
                        <span className="text-[11px] leading-relaxed text-muted-foreground">{tip.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setResults(null)}
                  className="w-full p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest text-muted-foreground"
                >
                  Run New Analysis
                </button>
              </div>
            ) : (
              <div className="glass-card h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Activity className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Awaiting Analysis</h3>
                <p className="text-muted-foreground max-w-sm">Adjust parameters on the left and click "Analyze" to see your battery's health profile data.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold flex items-center gap-2">
              <History className="w-5 h-5 text-purple-500" />
              Recent Diagnosis History
            </h4>
            <a href="/api/export_pdf" className="text-xs text-primary hover:underline font-bold flex items-center gap-1">
              <FileText className="w-3 h-3" /> Export All (PDF)
            </a>
          </div>
          <HistoryTable />
        </div>
      )}
    </div>
  );
}

function HistoryTable() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        if (data.success) setHistory(data.history);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-4 text-muted-foreground text-sm">Loading history...</div>;
  if (!history.length) return <div className="text-center py-4 text-muted-foreground text-sm">No records found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border/50 text-muted-foreground">
            <th className="pb-3 font-medium">Date</th>
            <th className="pb-3 font-medium text-center">Stress</th>
            <th className="pb-3 font-medium text-center">Health</th>
            <th className="pb-3 font-medium text-center">RUL</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {history.slice(0, 5).map((h) => (
            <tr key={h.id} className="group hover:bg-white/5 transition-colors">
              <td className="py-3 text-foreground/80">{h.timestamp}</td>
              <td className="py-3 text-center">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  h.stress === 'Low' ? 'bg-green-500/10 text-green-500' :
                  h.stress === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-red-500/10 text-red-500'
                }`}>
                  {h.stress}
                </span>
              </td>
              <td className="py-3 text-center font-bold">{h.health}%</td>
              <td className="py-3 text-center text-muted-foreground">{h.rul} cycles</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TechnicianView() {
  const [activeTab, setActiveTab] = useState<'manual' | 'batch' | 'fleet'>('manual');
  
  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-muted/30 rounded-xl w-fit mb-4">
        <button 
          onClick={() => setActiveTab('manual')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'manual' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted text-muted-foreground'}`}
        >
          Manual Diagnostics
        </button>
        <button 
          onClick={() => setActiveTab('batch')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'batch' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted text-muted-foreground'}`}
        >
          Batch CSV Upload
        </button>
        <button 
          onClick={() => setActiveTab('fleet')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'fleet' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-muted text-muted-foreground'}`}
        >
          Fleet History
        </button>
      </div>

      {activeTab === 'manual' && <ManualDiagnostics />}
      {activeTab === 'batch' && <BatchUpload />}
      {activeTab === 'fleet' && <FleetHistory />}
    </div>
  );
}

function ManualDiagnostics() {
  const [inputs, setInputs] = useState<any>({
    voltage_mean: 3.55, voltage_min: 2.85, voltage_std: 0.22,
    current_mean: -1.05, current_std: 0.18, current_min: -1.12,
    temp_mean: 28, temp_max: 34, temp_std: 2.1,
    duration: 3800, voltage_load_mean: 3.10,
    voltage_range: 0.70, temp_rise: 6.0,
    power_mean: 3.73, energy_delivered: 4.2,
    ambient_temperature: 24, cycle_number: 50
  });
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleInput = (key: string, val: string) => {
    setInputs({ ...inputs, [key]: parseFloat(val) || 0 });
  };

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/predict/technician', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      const data = await resp.json();
      if (data.success) setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 space-y-4">
        <div className="glass-strong rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-500">
            <Cpu className="w-5 h-5" /> Sensor Readings
          </h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <DiagnosticGroup title="Voltage (V)" icon={<Zap className="text-orange-500 w-4 h-4" />}>
              <DiagInput label="Mean" val={inputs.voltage_mean} onChange={(v) => handleInput('voltage_mean', v)} />
              <DiagInput label="Min" val={inputs.voltage_min} onChange={(v) => handleInput('voltage_min', v)} />
              <DiagInput label="Std" val={inputs.voltage_std} onChange={(v) => handleInput('voltage_std', v)} />
            </DiagnosticGroup>
            
            <DiagnosticGroup title="Current (A)" icon={<Activity className="text-red-500 w-4 h-4" />}>
              <DiagInput label="Mean" val={inputs.current_mean} onChange={(v) => handleInput('current_mean', v)} />
              <DiagInput label="Std" val={inputs.current_std} onChange={(v) => handleInput('current_std', v)} />
              <DiagInput label="Min" val={inputs.current_min} onChange={(v) => handleInput('current_min', v)} />
            </DiagnosticGroup>

            <DiagnosticGroup title="Temperature (C)" icon={<Activity className="text-blue-500 w-4 h-4" />}>
              <DiagInput label="Mean" val={inputs.temp_mean} onChange={(v) => handleInput('temp_mean', v)} />
              <DiagInput label="Max" val={inputs.temp_max} onChange={(v) => handleInput('temp_max', v)} />
              <DiagInput label="Std" val={inputs.temp_std} onChange={(v) => handleInput('temp_std', v)} />
            </DiagnosticGroup>

            <DiagnosticGroup title="Other Parameters" icon={<BarChart3 className="text-green-500 w-4 h-4" />}>
              <DiagInput label="Power" val={inputs.power_mean} onChange={(v) => handleInput('power_mean', v)} />
              <DiagInput label="Energy" val={inputs.energy_delivered} onChange={(v) => handleInput('energy_delivered', v)} />
              <DiagInput label="Cycle" val={inputs.cycle_number} onChange={(v) => handleInput('cycle_number', v)} />
            </DiagnosticGroup>
          </div>
          <button 
            onClick={runDiagnostics}
            disabled={loading}
            className="w-full mt-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all glow-primary flex items-center justify-center gap-2"
          >
            {loading ? 'Running diagnostics...' : 'Run Full Diagnostics'}
          </button>
        </div>
      </div>

      <div className="lg:col-span-7">
        {results ? (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <ResultCard 
                label="Health Score" 
                value={results.health_score} 
                status={results.health_info.status} 
                color={results.health_info.color}
                unit="/100"
              />
              <ResultCard 
                label="Stress Level" 
                value={results.stress_label} 
                status={results.stress_info.message} 
                color={results.stress_info.color}
              />
            </div>
            
            <div className="glass-strong rounded-2xl p-6">
              <h4 className="font-bold flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-green-500" />
                Technical Insights
              </h4>
              <div className="space-y-3">
                <InsightItem color={results.health_info.color} text={results.health_info.status} />
                <InsightItem color={results.stress_info.color} text={results.stress_info.message} />
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-strong rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
            <Cpu className="w-16 h-16 text-muted-foreground/30 mb-6 animate-pulse" />
            <h3 className="text-xl font-bold text-foreground">Awaiting Sensor Data</h3>
            <p className="text-muted-foreground max-w-sm mt-2">Fill the 17-sensor diagnostic parameters on the left to generate a comprehensive health report.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DiagnosticGroup({ title, icon, children }: any) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-3">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {icon} {title}
      </div>
      <div className="grid grid-cols-3 gap-3">{children}</div>
    </div>
  );
}

function DiagInput({ label, val, onChange }: any) {
  return (
    <div>
      <label className="text-[10px] text-muted-foreground block mb-1">{label}</label>
      <input 
        type="number" 
        value={val}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-muted/50 border border-white/10 rounded-lg p-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary/50" 
      />
    </div>
  );
}

function InsightItem({ color, text }: any) {
  const cMap: any = { success: 'bg-green-500', primary: 'bg-blue-500', warning: 'bg-yellow-500', danger: 'bg-red-500' };
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
      <div className={`w-2 h-2 rounded-full ${cMap[color] || 'bg-primary'}`} />
      <span className="text-sm text-foreground/80">{text}</span>
    </div>
  );
}

function BatchUpload() {
  return (
    <div className="glass-strong rounded-2xl p-12 text-center max-w-2xl mx-auto">
      <FileText className="w-16 h-16 text-primary mb-6 mx-auto" />
      <h3 className="text-2xl font-bold mb-4">Batch Fleet Diagnostics</h3>
      <p className="text-muted-foreground mb-8">
        Upload a CSV file containing sensor logs for multiple batteries. Our AI will process each row and provide a consolidated risk report.
      </p>
      <div className="border-2 border-dashed border-primary/20 rounded-2xl p-12 hover:border-primary/50 transition-all cursor-pointer group">
        <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-all mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Click to browse or drag and drop your battery log (.csv)</p>
      </div>
      <div className="mt-8 flex justify-center gap-4">
        <a href="/api/download_sample_csv" className="text-xs text-primary hover:underline font-bold">Download Sample Template</a>
      </div>
    </div>
  );
}

function FleetHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        if (data.success) setHistory(data.history);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center py-12 text-muted-foreground">Scanning fleet records...</p>;

  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <h4 className="font-bold flex items-center gap-2">
          <History className="w-5 h-5 text-primary" /> Fleet Diagnostic Logs
        </h4>
        <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold uppercase tracking-wider">
          {history.length} Records Found
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs uppercase text-muted-foreground bg-white/5">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Stress</th>
              <th className="p-4">Health</th>
              <th className="p-4">RUL</th>
              <th className="p-4">Efficiency</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {history.map((h) => (
              <tr key={h.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 text-sm font-mono">{h.timestamp}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    h.stress === 'Low' ? 'text-green-500 bg-green-500/10' :
                    h.stress === 'Medium' ? 'text-yellow-500 bg-yellow-500/10' :
                    'text-red-500 bg-red-500/10'
                  }`}>
                    {h.stress}
                  </span>
                </td>
                <td className="p-4 text-sm font-bold">{h.health}%</td>
                <td className="p-4 text-sm text-muted-foreground">{h.rul} cycles</td>
                <td className="p-4 text-sm">{h.efficiency}%</td>
                <td className="p-4">
                  <a href={`/api/export_pdf/${h.id}`} className="p-2 hover:bg-white/10 rounded-lg text-primary transition-all inline-block">
                    <FileText className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SliderField({ label, value, min, max, unit, onChange }: any) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm font-bold text-primary">{value}{unit}</span>
      </div>
      <input 
        type="range" 
        min={min} max={max} 
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
      />
      <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

function ResultCard({ label, value, status, color, unit = "" }: any) {
  const colorMap: any = {
    success: 'text-green-500 bg-green-500/10',
    primary: 'text-blue-500 bg-blue-500/10',
    warning: 'text-yellow-500 bg-yellow-500/10',
    danger:  'text-red-500 bg-red-500/10',
  };

  return (
    <div className="glass-card p-5">
      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">{label}</p>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      <div className={`px-2 py-1 rounded-md text-[10px] font-bold inline-block ${colorMap[color] || colorMap.primary}`}>
        {status}
      </div>
    </div>
  );
}
