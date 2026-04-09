import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Activity, ShieldCheck, ArrowRight } from 'lucide-react';

export default function DiagnosticPreview() {
  const [batteryPct, setBatteryPct] = useState(80);
  const [temp, setTemp] = useState(30);
  const navigate = useNavigate();

  const handleAction = () => {
    const session = localStorage.getItem('batteryiq_session');
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/login?redirect=dashboard');
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4 block">Interactive Tool</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
              Test Our <span className="text-gradient">AI Health Engine</span> Live
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Experience the power of our ML models. Adjust the parameters to simulate different EV battery states and see how our system analyzes health in real-time.
            </p>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">NASA-Grade Data</h4>
                  <p className="text-sm text-muted-foreground">Models trained on high-fidelity battery datasets from Ames Research Center.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">98.2% Accuracy</h4>
                  <p className="text-sm text-muted-foreground">Precision analysis across 17 different sensor parameters.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAction}
              className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all glow-primary flex items-center gap-3"
            >
              Access Full Dashboard <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="glass-strong rounded-3xl p-8 border border-white/10 relative">
            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider glow-primary">
              Live Preview
            </div>
            
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <Zap className="text-primary w-6 h-6" /> Driver Simulation
            </h3>
            
            <div className="space-y-10">
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-bold text-foreground uppercase tracking-wide">Battery Level (SoC)</label>
                  <span className="text-primary font-bold">{batteryPct}%</span>
                </div>
                <input 
                  type="range" min="10" max="100" value={batteryPct}
                  onChange={(e) => setBatteryPct(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" 
                />
              </div>

              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-bold text-foreground uppercase tracking-wide">Battery Temperature</label>
                  <span className="text-primary font-bold">{temp}°C</span>
                </div>
                <input 
                  type="range" min="5" max="65" value={temp}
                  onChange={(e) => setTemp(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" 
                />
              </div>

              <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <h4 className="font-bold mb-2">Detailed Analysis Locked</h4>
                <p className="text-xs text-muted-foreground mb-6">Create an account or login to see the full ML prediction of health score, stress level, and useful life.</p>
                <button 
                  onClick={handleAction}
                  className="w-full py-3 glass hover:bg-white/10 transition-all font-bold rounded-xl text-xs uppercase tracking-widest"
                >
                  Unlock AI Insights
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
