import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Volume2, VolumeX } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const KB: Record<string, string> = {
  'hello': 'Hello! Welcome to BatteryIQ. How can I help you today?',
  'hi': 'Hi there! I\'m the BatteryIQ assistant. Ask me anything about our battery intelligence platform.',
  'what is batteryiq': 'BatteryIQ is an AI-powered battery health monitoring system designed for electric fleets. We predict battery stress, health, remaining useful life, and efficiency using machine learning trained on NASA battery data.',
  'health': 'Our AI Health Predictor analyzes 17 sensor features to calculate a battery health score from 0-100, along with stress level (Low/Medium/High), remaining useful life, and efficiency percentage.',
  'pricing': 'We offer three plans: Starter ($299/mo for up to 25 vehicles), Professional ($799/mo for up to 100 vehicles), and Enterprise (custom pricing for unlimited fleets). Visit our Pricing page for details.',
  'models': 'We use 4 machine learning models: stress_model (stress level prediction), health_model (SOH scoring), rul_model (remaining useful life), and eff_model (efficiency). All trained on NASA battery cycling data with 97-99% accuracy.',
  'features': 'Key features include: AI Health Predictor, Fleet Dashboard, Charger Locator, Predictive Maintenance Alerts, Driver/Technician dual-mode views, CSV batch analysis, and a REST API for integration.',
  'contact': 'You can reach us at contact@batteryiq.ai or call +91 98765 43210. We\'re based in Mumbai, India.',
  'demo': 'You can request a live demo by visiting our Contact page or clicking "Get Started" in the navigation. We\'ll set up a personalized walkthrough of the platform.',
  'rul': 'Remaining Useful Life (RUL) predicts how many charge cycles your battery has before it needs replacement. Our model estimates this based on capacity fade, impedance growth, and environmental factors.',
  'stress': 'Battery stress levels are classified as Low (healthy, normal operation), Medium (showing aging, monitor closely), or High (service recommended). Our stress model analyzes thermal, electrical, and cycling patterns.',
  'efficiency': 'Battery efficiency measures how well your battery converts stored energy to usable power. We calculate this as a percentage based on impedance, capacity retention, and charge/discharge patterns.',
  'charger': 'Our Charger Locator helps you find the nearest EV charging stations and BatteryIQ-certified repair shops. Available in the Services section.',
  'api': 'BatteryIQ offers a REST API for integrating battery predictions into your fleet management system. Submit sensor readings and get real-time health assessments in JSON format.',
  'hardware': 'Our hardware products include the BMS Pro Module ($4,200) for real-time monitoring, and the Sensor Array Kit ($1,800) for retrofitting existing battery packs.',
  'software': 'Our software platform includes real-time battery analytics, predictive maintenance, fleet management dashboard, and API access. Available as cloud-hosted or on-premise deployment.',
};

function findAnswer(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const [key, val] of Object.entries(KB)) {
    if (lower.includes(key)) return val;
  }
  if (lower.includes('thank')) return 'You\'re welcome! Let me know if you need anything else.';
  if (lower.includes('bye')) return 'Goodbye! Feel free to come back anytime. ⚡';
  return 'I\'m not sure about that. You can ask me about our products, services, pricing, features, battery health, or contact information. For specific inquiries, please reach out at contact@batteryiq.ai.';
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! I\'m the BatteryIQ assistant. Ask me about our products, services, or battery technology. 🔋' }
  ]);
  const [input, setInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const speak = (text: string) => {
    if (!voiceEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setTimeout(() => {
      const answer = findAnswer(userMsg);
      setMessages((prev) => [...prev, { role: 'bot', text: answer }]);
      speak(answer);
    }, 500);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${open ? 'bg-muted rotate-90' : 'bg-primary glow-primary hover:scale-110'}`}
      >
        {open ? <X className="w-6 h-6 text-foreground" /> : <MessageCircle className="w-6 h-6 text-primary-foreground" />}
      </button>

      {/* Chat panel */}
      <div className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] transition-all duration-300 ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl flex flex-col" style={{ height: '480px' }}>
          {/* Header */}
          <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-semibold text-foreground">BatteryIQ Assistant</span>
            </div>
            <button onClick={() => setVoiceEnabled(!voiceEnabled)} className="text-muted-foreground hover:text-primary transition-colors" title={voiceEnabled ? 'Disable voice' : 'Enable voice'}>
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-secondary text-secondary-foreground rounded-bl-md'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border/30">
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about BatteryIQ..."
                className="flex-1 bg-muted/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
              <button type="submit" className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
