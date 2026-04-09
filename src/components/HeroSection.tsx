import { Button } from "@/components/ui/button";
import { ClipboardList, Swords, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23258B58' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <ClipboardList className="h-4 w-4" />
          Your All-in-One Sports Platform
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
          Professional Sports Reports in <span className="text-primary">Minutes</span>
        </h1>

        <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Player progress reports, tactical match analysis, Word & PDF exports — all with AI-powered intelligence. Choose templates, tones, and colors.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            size="lg"
            className="text-base px-8 py-6 font-semibold shadow-lg shadow-primary/20"
            onClick={() => navigate("/player-reports")}
          >
            <ClipboardList className="mr-2 h-5 w-5" />
            Player Reports
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-base px-8 py-6 font-semibold"
            onClick={() => navigate("/match-reports")}
          >
            <Swords className="mr-2 h-5 w-5" />
            Match Reports
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Cricket · Football · Badminton · Table Tennis · Basketball · Volleyball · Any Sport
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-2xl mx-auto">
          {[
            { label: "AI-Powered", desc: "Smart reports with contextual analysis" },
            { label: "5 Templates", desc: "Choose your academy's style" },
            { label: "PDF & Word", desc: "Export in any format" },
            { label: "WhatsApp Share", desc: "Instant sharing with parents" },
          ].map((f) => (
            <div key={f.label} className="bg-card rounded-lg border p-3 text-left">
              <p className="text-sm font-bold text-foreground">{f.label}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
