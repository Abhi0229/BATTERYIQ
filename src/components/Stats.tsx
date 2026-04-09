import { useEffect, useRef, useState } from 'react';
import ScrollReveal from './ScrollReveal';

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ target, suffix, decimals = 0 }: { target: number; suffix: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(parseFloat((eased * target).toFixed(decimals)));
          if (progress < 1) requestAnimationFrame(animate);
          else setCount(target);
        };
        animate();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, decimals]);

  const display =
    decimals > 0
      ? count.toFixed(decimals)
      : target >= 1000
      ? Math.floor(count).toLocaleString()
      : Math.floor(count).toString();

  return (
    <div ref={ref} className="text-4xl sm:text-5xl font-bold font-mono text-gradient">
      {display}{suffix}
    </div>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface FleetStats {
  total_batteries: number;
  total_cycles: number;
  avg_health: number;
  avg_efficiency: number;
  low_stress_pct: number;
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Stats() {
  const [data, setData] = useState<FleetStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fleet_stats')
      .then(r => r.json())
      .then(json => {
        if (json.success) setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fallback static stats while loading or if API is unavailable
  const stats = data
    ? [
        {
          value: data.total_batteries,
          suffix: '',
          decimals: 0,
          label: 'Batteries Monitored',
          desc: 'Real NASA research batteries',
        },
        {
          value: data.avg_health,
          suffix: '%',
          decimals: 1,
          label: 'Avg Health Score',
          desc: 'Across all monitored batteries',
        },
        {
          value: data.total_cycles,
          suffix: '+',
          decimals: 0,
          label: 'Charge Cycles Analyzed',
          desc: 'Total data points in dataset',
        },
        {
          value: data.avg_efficiency,
          suffix: '%',
          decimals: 1,
          label: 'Avg Efficiency',
          desc: 'Mean efficiency score across fleet',
        },
      ]
    : [
        { value: 0,    suffix: '',  decimals: 0, label: 'Batteries Monitored', desc: 'Loading...' },
        { value: 0,    suffix: '%', decimals: 1, label: 'Avg Health Score',    desc: 'Loading...' },
        { value: 0,    suffix: '+', decimals: 0, label: 'Cycles Analyzed',     desc: 'Loading...' },
        { value: 0,    suffix: '%', decimals: 1, label: 'Avg Efficiency',      desc: 'Loading...' },
      ];

  return (
    <section className="py-20 border-y border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Live Dataset Metrics
          </span>
          <p className="text-muted-foreground text-sm mt-2">
            Numbers computed in real-time from the NASA Battery Research dataset
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 100}>
              <div className="text-center">
                {loading ? (
                  <div className="text-4xl sm:text-5xl font-bold font-mono text-muted-foreground/30 animate-pulse">
                    —
                  </div>
                ) : (
                  <Counter target={s.value} suffix={s.suffix} decimals={s.decimals} />
                )}
                <div className="text-sm font-semibold text-foreground mt-2">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Extra row: stress breakdown badge */}
        {data && (
          <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-up">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-bold text-green-500">
                {data.low_stress_pct}% Low-Stress Cycles
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-bold text-primary">
                4 Active ML Models
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-blue-500">
                17 Sensor Parameters Tracked
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
