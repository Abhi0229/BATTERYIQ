import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Activity, ShieldCheck, ArrowRight } from 'lucide-react';

export default function DiagnosticPreview() {
  const [batteryPct, setBatteryPct] = useState(80);
  const [temp, setTemp] = useState(30);
  const [cycles, setCycles] = useState(50);
  const navigate = useNavigate();

  // Simple heuristic for preview
  const estHealth = Math.max(0, 100 - (cycles / 10) - (temp > 45 ? (temp - 45) * 1.5 : 0));

  const handleAction = () => {
    const session = localStorage.getItem('batteryiq_session');
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/login?redirect=dashboard');
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-slate-950/50">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="lg:pt-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
              <Zap className="w-3.5 h-3.5" />
              Live AI Sandbox
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
              Test Our <span className="text-gradient">Health Engine</span> Pro
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Experience the power of our ML models. Adjust the parameters to simulate different EV battery states and see how our system analyzes health in real-time.
            </p>
            
            <div className="space-y-6 mb-10">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 relative group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-500" /> "Why" Analysis
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {temp > 45 
                    ? "High temperature detected. Our models predict accelerated electrolyte evaporation at these levels."
                    : estHealth < 85 
                    ? "Cycle count is the primary driver here. Internal resistance usually climbs after 400 cycles."
                    : "Current parameters indicate optimal preservation of electrode integrity."}
                </p>
              </div>
            </div>

            <button 
              onClick={handleAction}
              className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:scale-105 transition-all glow-primary flex items-center gap-3 shadow-xl shadow-primary/20"
            >
              Access Full Diagnostic Hub <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="glass-strong rounded-[2.5rem] p-10 border border-white/10 relative shadow-2xl">
            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider glow-primary flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Simulating AI Model v2.4
            </div>
            
            <div className="grid grid-cols-1 gap-8 mb-10">
               <div className="space-y-6">
                <SliderField label="Battery Level" value={batteryPct} min={10} max={100} unit="%" onChange={setBatteryPct} />
                <SliderField label="Temperature" value={temp} min={5} max={65} unit="°C" onChange={setTemp} />
                <SliderField label="Charge Cycles" value={cycles} min={0} max={1000} unit="" onChange={setCycles} />
              </div>

              <div className="p-8 rounded-3xl bg-primary/10 border border-primary/20 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer" />
                <div className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-4">Estimated Health</div>
                <div className="text-6xl font-bold text-foreground mb-4 tracking-tighter">
                  {estHealth.toFixed(1)}<span className="text-2xl text-primary/50 text-muted-foreground">%</span>
                </div>
                
                <div className="h-px w-1/2 mx-auto bg-white/10 mb-6" />
                
                <div className="flex items-center justify-center gap-4 mb-6 opacity-40 grayscale pointer-events-none">
                   <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-lg bg-white/5 mb-1" />
                      <div className="w-12 h-2 bg-white/5 rounded" />
                   </div>
                   <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-lg bg-white/5 mb-1" />
                      <div className="w-12 h-2 bg-white/5 rounded" />
                   </div>
                </div>

                <button 
                  onClick={handleAction}
                  className="w-full py-4 bg-white/10 hover:bg-white/20 transition-all font-bold rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border border-white/10"
                >
                  <Activity className="w-4 h-4" /> Unlock Detailed Stress & RUL Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SliderField({ label, value, min, max, unit, onChange }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</label>
        <span className="text-sm font-extrabold text-foreground">{value}{unit}</span>
      </div>
      <input 
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all" 
      />
    </div>
  );
}
