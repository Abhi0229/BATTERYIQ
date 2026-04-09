import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import BatteryModel from './BatteryModel';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <BatteryModel />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background z-[1]" />
      <div className="absolute inset-0 gradient-radial z-[1]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-medium text-primary mb-8 animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Powered by NASA Battery Research Data
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <span className="text-foreground">Get Live Insights</span>
          <br />
          <span className="text-gradient">Powered by AI</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '200ms' }}>
          Real-time, in-depth analysis of every battery's health. Track performance, predict future behavior, and get alerts before failures happen — all from one intelligent platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
          <Link
            to="/signup"
            className="group px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all duration-300 glow-primary flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/services"
            className="px-8 py-3.5 font-semibold rounded-xl border border-border/50 text-foreground hover:bg-secondary/50 transition-all duration-300 flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-primary" />
            Explore Services
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-xs text-muted-foreground animate-fade-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-2">
            <span className="text-primary font-mono font-bold text-lg">97%</span>
            <span>Prediction Accuracy</span>
          </div>
          <div className="w-px h-6 bg-border/50" />
          <div className="flex items-center gap-2">
            <span className="text-primary font-mono font-bold text-lg">10K+</span>
            <span>Batteries Monitored</span>
          </div>
          <div className="w-px h-6 bg-border/50" />
          <div className="flex items-center gap-2">
            <span className="text-primary font-mono font-bold text-lg">4</span>
            <span>AI Models</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-fade-up" style={{ animationDelay: '700ms' }}>
        <span className="text-xs text-muted-foreground">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </section>
  );
}
