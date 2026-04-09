import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Stats from '@/components/Stats';
import DiagnosticPreview from '@/components/DiagnosticPreview';
import Benefits from '@/components/Benefits';
import CTASection from '@/components/CTASection';
import HowItWorks from '@/components/HowItWorks';
import Industries from '@/components/Industries';
import ScrollReveal from '@/components/ScrollReveal';

export default function Index() {
  return (
    <>
      <Hero />
      <Stats />
      <DiagnosticPreview />
      <Features />
      <HowItWorks />
      <Industries />
      <Benefits />
      <CTASection />
    </>
  );
}
