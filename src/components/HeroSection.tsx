import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Medal, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SPORT_ICONS = [
  "⚽", "🏏", "🏀", "🎾", "🏸", "🏓", "🏐", "⚾", "🏉", "🏑",
  "🏒", "⛳", "🏊", "🏃", "🥊", "🥋", "🤸", "🚴", "🤾", "🤼",
  "🤺", "🏹", "🚣", "🏄", "🏋️", "⛵", "🛹", "🎯", "🏇", "🥍",
];
const SPORT_LABELS = [
  "Football", "Cricket", "Basketball", "Tennis", "Badminton", "Table Tennis", "Volleyball", "Baseball", "Rugby", "Hockey",
  "Ice Hockey", "Golf", "Swimming", "Athletics", "Boxing", "MMA", "Gymnastics", "Cycling", "Handball", "Wrestling",
  "Fencing", "Archery", "Rowing", "Surfing", "Weightlifting", "Sailing", "Skateboarding", "Squash", "Equestrian", "Lacrosse",
];

const PERSONAS = [
  { icon: Users, title: "For Coaches", desc: "Generate AI reports, plan training, track attendance — in minutes not hours." },
  { icon: Medal, title: "For Athletes", desc: "Shareable progress cards, injury logs, and performance tracking across seasons." },
  { icon: Building2, title: "For Organisations", desc: "Multi-academy management, contracts, finances, and tournament ops — one platform." },
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23258B58' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-5xl"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Shield className="h-4 w-4" />
          The World's Complete Sports Documentation Platform
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
          Everything Your Academy Needs — <span className="text-primary">One Platform</span>
        </h1>

        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Player reports, match analysis, contract building, injury tracking, training planning, tournament management, and financial records — all powered by AI across 30+ sports.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            size="lg"
            className="text-base px-8 py-6 font-semibold shadow-lg shadow-primary/20"
            onClick={() => navigate("/auth")}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-base px-8 py-6 font-semibold"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </Button>
        </div>

        {/* Persona Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto">
          {PERSONAS.map((p) => (
            <div key={p.title} className="bg-card rounded-xl border p-5 text-left">
              <p.icon className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-bold text-foreground text-sm">{p.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Sport Grid Scrolling Strip */}
        <div className="mt-10 overflow-hidden relative max-w-4xl mx-auto">
          <div className="flex gap-3 animate-scroll">
            {[...SPORT_ICONS, ...SPORT_ICONS].map((icon, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex flex-col items-center justify-center bg-card border rounded-lg w-20 h-20 hover:border-primary/50 transition-colors"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-[10px] text-muted-foreground mt-1 font-medium">
                  {SPORT_LABELS[i % SPORT_LABELS.length]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Authority Proof */}
        <div className="mt-10 rounded-xl border bg-card/50 p-6 max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-foreground mb-2">Trusted Documentation Standards</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Documentation standards sourced from official governing bodies. Covering <span className="text-primary font-semibold">FIFA, ICC, BWF, FIBA, ITF, World Athletics, FIVB</span> and 23+ more international federations. Sport-specific terminology, scoring systems, and tactical frameworks built in.
          </p>
        </div>

        {/* Free Access Note */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">✓ Free to explore</span>
          <span className="flex items-center gap-1">✓ No credit card needed</span>
          <span className="flex items-center gap-1">✓ Export anytime</span>
        </div>
      </motion.div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
