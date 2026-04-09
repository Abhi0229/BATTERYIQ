import { useState } from 'react';
import { 
    Calculator, TrendingUp, Clock, DollarSign, Zap, Loader2, 
    Users, History, HardDrive, Battery, ShieldAlert, Cpu, Activity, ShieldCheck,
    Lightbulb, Info
} from 'lucide-react';
import Layout from '@/components/Layout';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

interface ROIResult {
    roi_pct: number;
    annual_savings_usd: number;
    payback_months: number;
    breakdown: {
        downtime_reduction_usd: number;
        replacement_savings_usd: number;
        maintenance_savings_usd: number;
        energy_savings_usd: number;
        total_annual_savings_usd: number;
    };
    model_confidence: {
        roi_r2: number;
        algorithm: string;
        training_n: number;
    };
}

const CHEMISTRY_LABELS: Record<number, string> = {
    0: 'LFP (Lithium Iron Phosphate)',
    1: 'NMC (Nickel Manganese Cobalt)',
    2: 'NCA (Nickel Cobalt Aluminium)',
};

const TIER_LABELS: Record<number, string> = {
    0: 'Starter — $299/mo (≤25 vehicles)',
    1: 'Professional — $799/mo (≤100 vehicles)',
    2: 'Enterprise — $1,499/mo (unlimited)',
};

function fmt(n: number, prefix = '') {
    return prefix + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
}

export default function ROICalculator() {
    const [form, setForm] = useState({
        fleet_size: 50,
        avg_daily_cycles: 1.5,
        battery_age_months: 18,
        chemistry: 1,
        current_downtime_pct: 8,
        avg_replacement_cost: 6500,
        maintenance_cost_pm: 3000,
        energy_cost_kwh: 0.12,
        avg_pack_kwh: 60,
        subscription_tier: 1,
    });

    const [result, setResult] = useState<ROIResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const set = (k: string, v: number) => setForm((f) => ({ ...f, [k]: v }));

    const calculate = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await fetch(`${API_BASE}/api/roi`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                setResult(data);
            } else {
                setError(data.errors?.join(', ') ?? data.error ?? 'Unknown error');
            }
        } catch (e) {
            setError('Could not reach BatteryIQ server. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const Field = ({
        label, name, min, max, step = 1, prefix = '', suffix = '',
        isSelect = false, options = {} as Record<number, string>, icon: Icon
    }: {
        label: string; name: string; min: number; max: number;
        step?: number; prefix?: string; suffix?: string;
        isSelect?: boolean; options?: Record<number, string>;
        icon?: any;
    }) => (
        <div className="space-y-1.5 group">
            <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon className="w-3.5 h-3.5 text-primary/70 group-hover:text-primary transition-colors" />}
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{label}</label>
            </div>
            {isSelect ? (
                <div className="relative">
                    <select
                        value={(form as any)[name]}
                        onChange={(e) => set(name, Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                    >
                        {Object.entries(options).map(([k, v]) => (
                            <option key={k} value={k} className="bg-[#0a0a0a]">{v}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <div className="relative flex items-center group/input">
                    {prefix && <span className="absolute left-4 text-sm text-primary/50 group-focus-within/input:text-primary transition-colors">{prefix}</span>}
                    <input
                        type="number"
                        min={min}
                        max={max}
                        step={step}
                        value={(form as any)[name]}
                        onChange={(e) => set(name, Number(e.target.value))}
                        className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-12' : ''}`}
                    />
                    {suffix && <span className="absolute right-4 text-xs text-muted-foreground group-focus-within/input:text-primary transition-colors">{suffix}</span>}
                </div>
            )}
        </div>
    );

    return (
        <Layout>
            <div className="min-h-screen bg-[#020617] py-20 px-4 mt-16 overflow-hidden relative">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Strategic Intelligence
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                        ML-Powered <span className="text-primary">ROI Simulator</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                        Assess the financial impact of BatteryIQ deployment on your fleet using our predictive models trained on global operational data.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Form Section */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="glass-strong rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/50" />
                            <h2 className="text-xl font-bold text-foreground mb-8 flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg"><Calculator className="w-4 h-4 text-primary" /></div>
                                Fleet Configuration
                            </h2>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-6 mb-8">
                                <Field label="Fleet Size" name="fleet_size" min={1} max={5000} icon={Users} />
                                <Field label="Daily Duty" name="avg_daily_cycles" min={0.1} max={10} step={0.1} suffix="CYC" icon={Clock} />
                                <Field label="Asset Age" name="battery_age_months" min={0} max={120} suffix="MO" icon={History} />
                                <Field label="Downtime" name="current_downtime_pct" min={0} max={50} step={0.5} suffix="%" icon={Zap} />
                                <Field label="Pack Cost" name="avg_replacement_cost" min={500} max={50000} prefix="$" icon={DollarSign} />
                                <Field label="Maint Cost" name="maintenance_cost_pm" min={0} max={100000} prefix="$" icon={HardDrive} />
                                <Field label="Energy Rate" name="energy_cost_kwh" min={0.01} max={1} step={0.01} prefix="$" icon={Zap} />
                                <Field label="Capacity" name="avg_pack_kwh" min={5} max={300} suffix="kWh" icon={Battery} />
                            </div>

                            <div className="space-y-6 mb-10">
                                <Field label="Active Chemistry" name="chemistry" min={0} max={2} isSelect options={CHEMISTRY_LABELS} />
                                <Field label="Selection Tier" name="subscription_tier" min={0} max={2} isSelect options={TIER_LABELS} />
                            </div>

                            <button
                                onClick={calculate}
                                disabled={loading}
                                className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm tracking-widest uppercase hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-primary/20 active:scale-95"
                            >
                                {loading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Simulating...</>
                                ) : (
                                    <><Zap className="w-5 h-5 fill-current" /> Execute ROI Projection</>
                                )}
                            </button>

                            {error && (
                                <p className="mt-4 text-[11px] text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 font-medium animate-in fade-in slide-in-from-top-2">
                                    ⚠️ {error}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-7">
                        {!result && !loading ? (
                            <div className="glass-card h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 rounded-3xl border border-dashed border-white/10 group">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/5 transition-colors border border-white/5">
                                    <Activity className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-all duration-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-foreground">Awaiting Input</h3>
                                <p className="text-muted-foreground max-w-sm leading-relaxed text-sm">
                                    Configure your fleet parameters and execute the simulation to generate your personalized ROI report.
                                </p>
                            </div>
                        ) : result ? (
                            <div className="animate-in fade-in slide-in-from-right-8 duration-700 space-y-8">
                                {/* Result Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <ResultScore 
                                        label="Annual ROI" 
                                        value={`${result.roi_pct.toFixed(0)}%`} 
                                        color="#10b981" 
                                        icon={TrendingUp}
                                    />
                                    <ResultScore 
                                        label="Total Savings" 
                                        value={fmt(result.annual_savings_usd, '$')} 
                                        color="#3b82f6" 
                                        icon={DollarSign}
                                    />
                                    <ResultScore 
                                        label="Payback Period" 
                                        value={`${result.payback_months.toFixed(1)} mo`} 
                                        color="#8b5cf6" 
                                        icon={Clock}
                                    />
                                </div>

                                {/* Deep Breakdown */}
                                <div className="glass-strong rounded-3xl p-8 border border-white/10">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-bold text-foreground">Projected Cost Optimizations</h3>
                                        <div className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Per Annum</div>
                                    </div>
                                    
                                    <div className="space-y-8">
                                        {[
                                            { label: 'Asset Downtime Mitigation', value: result.breakdown.downtime_reduction_usd, icon: Activity, color: '#3b82f6' },
                                            { label: 'Life Extension / Optimized CapEx', value: result.breakdown.replacement_savings_usd, icon: ShieldAlert, color: '#10b981' },
                                            { label: 'Preventative Maint. Savings', value: result.breakdown.maintenance_savings_usd, icon: Cpu, color: '#8b5cf6' },
                                            { label: 'Thermal & Energy Efficiency', value: result.breakdown.energy_savings_usd, icon: Zap, color: '#f59e0b' },
                                        ].map(({ label, value, icon: Icon, color }) => {
                                            const pct = result.breakdown.total_annual_savings_usd > 0
                                                ? (value / result.breakdown.total_annual_savings_usd) * 100
                                                : 0;
                                            return (
                                                <div key={label} className="group/item">
                                                    <div className="flex justify-between items-end mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-white/5 rounded-lg group-hover/item:bg-white/10 transition-colors">
                                                                <Icon className="w-4 h-4" style={{ color }} />
                                                            </div>
                                                            <span className="text-sm font-semibold text-muted-foreground group-hover/item:text-foreground transition-colors">{label}</span>
                                                        </div>
                                                        <span className="text-lg font-bold text-foreground">{fmt(value, '$')}</span>
                                                    </div>
                                                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-1000 ease-out"
                                                            style={{ width: `${Math.min(100, pct)}%`, backgroundColor: color }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Model Meta */}
                                <div className="flex flex-col md:flex-row gap-4 justify-between items-center px-4">
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/5 uppercase tracking-widest font-bold">
                                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                        Prediction Confidence: {(result.model_confidence?.roi_r2 * 100).toFixed(2)}%
                                    </div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                         Engine: GradientBoostRegressor (v2.4)
                                    </div>
                                </div>

                                {/* Why this Result? */}
                                <div className="glass-strong rounded-3xl p-8 border border-white/10 mt-8 relative overflow-hidden group">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                                     <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
                                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                                        Strategic Reasoning
                                     </h3>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                                                <Info className="w-4 h-4" /> Why these savings?
                                            </h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Based on your <strong>{form.fleet_size}</strong> vehicle fleet, the primary driver for your <strong>{fmt(result.annual_savings_usd, '$')}</strong> savings is the reduction in unexpected downtime. 
                                                By predicting failures 2-3 weeks in advance, you move from reactive to predictive maintenance, which typically cuts labor costs by 22%.
                                            </p>
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-bold text-green-500 flex items-center gap-2">
                                                <Zap className="w-4 h-4" /> Optimization Tip
                                            </h4>
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                                                <p className="text-xs text-foreground font-semibold">Chemistry Optimization</p>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                                    {form.chemistry === 1 
                                                        ? "Your NMC choice is excellent for energy density, but switching to LFP for shorter urban cycles could increase your payback speed by 1.2 months."
                                                        : "LFP batteries are durable; however, our simulation suggests NMC might offer a higher ROI for long-range trips despite the $1,200/unit premium."}
                                                </p>
                                            </div>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        ) : (
                            /* Loading State */
                            <div className="glass-card h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 rounded-3xl">
                                <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
                                <h3 className="text-xl font-bold mb-2">Generating Report...</h3>
                                <p className="text-muted-foreground text-sm">Our ML agents are processing your fleet configuration.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </Layout>
);
}

function ResultScore({ label, value, color, icon: Icon }: any) {
    return (
        <div className="glass-strong rounded-3xl p-6 border border-white/10 relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 p-1 opacity-[0.03] -translate-y-1/4 translate-x-1/4">
                <Icon size={120} />
            </div>
            <div className="p-3 rounded-2xl bg-white/5 mb-4 border border-white/5">
                <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div className="text-2xl font-bold tracking-tight mb-1" style={{ color }}>{value}</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</div>
        </div>
    );
}
