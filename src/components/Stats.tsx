import { useEffect, useRef, useState } from 'react';
import ScrollReveal from './ScrollReveal';

const stats = [
  { value: 97, suffix: '%', label: 'Model Accuracy', desc: 'Across all 4 ML models' },
  { value: 10000, suffix: '+', label: 'Batteries Monitored', desc: 'And growing every day' },
  { value: 4, suffix: '', label: 'ML Models', desc: 'Stress, Health, RUL, Efficiency' },
  { value: 99.9, suffix: '%', label: 'Uptime', desc: 'Enterprise-grade reliability' },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
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
          setCount(Math.floor(eased * target * 10) / 10);
          if (progress < 1) requestAnimationFrame(animate);
          else setCount(target);
        };
        animate();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display = target >= 100 ? Math.floor(count).toLocaleString() : count.toFixed(target % 1 !== 0 ? 1 : 0);

  return (
    <div ref={ref} className="text-4xl sm:text-5xl font-bold font-mono text-gradient">
      {display}{suffix}
    </div>
  );
}

export default function Stats() {
  return (
    <section className="py-20 border-y border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 100}>
              <div className="text-center">
                <Counter target={s.value} suffix={s.suffix} />
                <div className="text-sm font-semibold text-foreground mt-2">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
