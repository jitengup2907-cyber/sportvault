import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Medal, Building2, ClipboardList, Swords, Video, FileText, Globe, MessageCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import LiveDemo from "@/components/LiveDemo";
import LandingFooter from "@/components/LandingFooter";

const SPORT_ITEMS = [
  { icon: "⚽", label: "Football" }, { icon: "🏏", label: "Cricket" }, { icon: "🏸", label: "Badminton" },
  { icon: "🏀", label: "Basketball" }, { icon: "🏑", label: "Hockey" }, { icon: "🏃", label: "Athletics" },
  { icon: "🎾", label: "Tennis" }, { icon: "🏓", label: "Table Tennis" }, { icon: "🥊", label: "Boxing" },
  { icon: "🤼", label: "Wrestling" }, { icon: "🏐", label: "Volleyball" }, { icon: "🏊", label: "Swimming" },
  { icon: "🏉", label: "Rugby" }, { icon: "🎯", label: "Archery" }, { icon: "🚴", label: "Cycling" },
  { icon: "🤸", label: "Gymnastics" }, { icon: "🚣", label: "Rowing" }, { icon: "🏋️", label: "Weightlifting" },
  { icon: "🥋", label: "Karate" }, { icon: "⛳", label: "Golf" }, { icon: "🏇", label: "Equestrian" },
  { label: "Kabaddi" }, { label: "Squash" }, { label: "Kho-Kho" }, { label: "Throwball" },
  { label: "Handball" }, { label: "Shooting" }, { label: "Judo" }, { label: "Taekwondo" }, { label: "Fencing" },
];

const PERSONAS = [
  { icon: Users, title: "For Coaches", desc: "Generate AI player reports in 60 seconds. Plan training sessions. Track injuries. All sports covered." },
  { icon: Building2, title: "For Academies", desc: "Manage your full roster, contracts, finances, and tournaments. From 10 players to 1,000." },
  { icon: Medal, title: "For Pro Clubs", desc: "AI video analysis, scouting reports, player contracts, and multi-team management. Built for serious organisations." },
];

const FEATURES = [
  { icon: ClipboardList, title: "AI Player Reports", desc: "Personalised progress reports for every player in 60 seconds. Parents love them." },
  { icon: Swords, title: "Match Analysis", desc: "Input stats, get a full tactical breakdown. For any sport." },
  { icon: Video, title: "Video Analysis", desc: "Upload match recordings. AI breaks down every play, tactic, and player movement.", badge: "NEW" },
  { icon: FileText, title: "Contract Builder", desc: "Draft player, coach, sponsorship, and transfer contracts using AI. Download as PDF." },
  { icon: Globe, title: "30+ Sports", desc: "Sport-specific terminology, positions, formations, and scoring built in for every sport." },
  { icon: MessageCircle, title: "WhatsApp Sharing", desc: "Send reports directly to parents via WhatsApp in one tap. No downloads needed." },
];

const TESTIMONIALS = [
  { initials: "RM", name: "Rahul M.", academy: "Rebels Football Academy, Hyderabad", quote: "Parents started asking about the reports before we even reminded them. Game changer." },
  { initials: "PS", name: "Priya S.", academy: "Ace Badminton Academy, Bangalore", quote: "I used to spend 3 hours writing reports. Now it takes 20 minutes for the whole batch." },
  { initials: "AK", name: "Arjun K.", academy: "Chennai Cricket Club", quote: "The contract builder alone saved us ₹15,000 in legal fees this season." },
];

const PRICING_PREVIEW = [
  { name: "Free", price: "₹0", period: "forever", highlight: false, features: ["20 players", "10 AI reports/mo", "3 match reports/mo"] },
  { name: "Club", price: "₹799", period: "/mo", highlight: true, features: ["75 players", "Unlimited reports", "Academy logo on PDFs"] },
  { name: "Pro", price: "₹1,999", period: "/mo", highlight: false, features: ["Unlimited everything", "Video analysis", "Shareable links"] },
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Public Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <span className="font-display font-extrabold text-lg text-primary">SportVault</span>
          <div className="hidden md:flex items-center gap-5">
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-muted-foreground hover:text-foreground">Features</button>
            <button onClick={() => document.getElementById("sports")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-muted-foreground hover:text-foreground">Sports</button>
            <button onClick={() => navigate("/pricing")} className="text-sm text-muted-foreground hover:text-foreground">Pricing</button>
            <button onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-muted-foreground hover:text-foreground">Video Analysis</button>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="ghost" onClick={() => navigate("/auth")}>Sign In</Button>
            <Button size="sm" onClick={() => navigate("/auth")}>Get Started Free</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-28 pb-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Shield className="h-4 w-4" />
            The Complete Sports Platform for India
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
            Every Sport. Every Record. <span className="text-primary">One Vault.</span>
          </h1>

          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AI-powered player reports, match analysis, contracts, video analysis, and game intelligence for 30+ sports — from grassroots academies to professional clubs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="text-base px-8 py-6 font-semibold shadow-lg shadow-primary/20" onClick={() => navigate("/auth")}>
              Start Free — No Card Needed <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-6 font-semibold" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>
              See How It Works
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">✓ Free forever plan</span>
            <span className="flex items-center gap-1">✓ 30+ sports</span>
            <span className="flex items-center gap-1">✓ No setup fees</span>
          </div>
        </motion.div>
      </section>

      {/* Sport Grid Strip */}
      <section id="sports" className="py-8 overflow-hidden">
        <div className="flex gap-3 animate-scroll">
          {[...SPORT_ITEMS, ...SPORT_ITEMS].map((s, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center justify-center bg-card border rounded-lg w-20 h-20 hover:border-primary/50 transition-colors">
              {s.icon && <span className="text-2xl">{s.icon}</span>}
              {!s.icon && <span className="text-lg">🏅</span>}
              <span className="text-[10px] text-muted-foreground mt-1 font-medium text-center leading-tight">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-extrabold text-foreground text-center mb-10">Who is this for?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PERSONAS.map((p) => (
              <div key={p.title} className="bg-card rounded-xl border p-6 text-left">
                <p.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold text-foreground text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-extrabold text-foreground text-center mb-10">Everything you need to run a modern sports academy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-card rounded-xl border p-6 relative">
                {f.badge && (
                  <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">{f.badge}</span>
                )}
                <f.icon className="h-7 w-7 text-primary mb-3" />
                <h3 className="font-bold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <LiveDemo />

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-extrabold text-foreground text-center mb-10">Trusted by academies across India</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-card rounded-xl border p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{t.initials}</div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.academy}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-muted-foreground italic">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-extrabold text-foreground text-center mb-10">Simple, transparent pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PREVIEW.map((p) => (
              <div key={p.name} className={`bg-card rounded-xl border-2 p-6 ${p.highlight ? "border-primary ring-2 ring-primary/20" : "border-border"}`}>
                {p.highlight && <span className="text-[10px] font-bold text-primary mb-2 block">MOST POPULAR</span>}
                <h3 className="font-bold text-xl text-foreground">{p.name}</h3>
                <p className="text-2xl font-extrabold text-foreground">{p.price}<span className="text-sm font-normal text-muted-foreground">{p.period}</span></p>
                <ul className="mt-4 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button variant="outline" onClick={() => navigate("/pricing")}>
              See full feature comparison <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Authority Proof */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold text-foreground mb-2">Trusted Documentation Standards</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Documentation standards sourced from official governing bodies. Covering <span className="text-primary font-semibold">FIFA, ICC, BWF, FIBA, ITF, World Athletics, FIVB</span> and 23+ more international federations.
          </p>
        </div>
      </section>

      <LandingFooter />

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
