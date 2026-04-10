import { Button } from "@/components/ui/button";
import { ClipboardList, ArrowRight, Shield, FileText, Activity, Trophy, Dumbbell, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
        className="relative z-10 max-w-4xl"
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12 max-w-3xl mx-auto">
          {[
            { label: "Player Reports", desc: "AI-powered progress analysis", icon: ClipboardList },
            { label: "Match Analysis", desc: "Tactical summaries & insights", icon: ClipboardList },
            { label: "Contracts", desc: "Player, coach & sponsor deals", icon: FileText },
            { label: "Injury Tracker", desc: "Medical records & recovery", icon: Activity },
            { label: "Training Plans", desc: "Sessions, drills & attendance", icon: Dumbbell },
            { label: "Tournaments", desc: "Fixtures, standings, results", icon: Trophy },
            { label: "Finances", desc: "Fees, budgets & payments", icon: DollarSign },
            { label: "Parent Portal", desc: "Shareable report links", icon: Shield },
          ].map((f) => (
            <div key={f.label} className="bg-card rounded-lg border p-3 text-left">
              <f.icon className="h-4 w-4 text-primary mb-1" />
              <p className="text-sm font-bold text-foreground">{f.label}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          ⚽ Football · 🏏 Cricket · 🏀 Basketball · 🎾 Tennis · 🏸 Badminton · 🏓 Table Tennis · 🏐 Volleyball · ⚾ Baseball · 🏉 Rugby · 🏑 Hockey · 🏒 Ice Hockey · ⛳ Golf · 🏊 Swimming · 🏃 Athletics · 🥊 Boxing · 🥋 MMA & Martial Arts · 🤸 Gymnastics · 🚴 Cycling · 🤾 Handball · 🤼 Wrestling · 🤺 Fencing · 🎯 Squash · 🚣 Rowing · 🏄 Surfing · 🏋️ Weightlifting · 🏹 Archery · ⛵ Sailing · 🛹 Skateboarding + More
        </p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
