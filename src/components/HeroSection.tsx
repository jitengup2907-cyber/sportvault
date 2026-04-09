import { Button } from "@/components/ui/button";
import { ClipboardList, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onStart: () => void;
}

const HeroSection = ({ onStart }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23258B58' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <ClipboardList className="h-4 w-4" />
          For Sports Academies
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
          Professional Report Cards in <span className="text-primary">Minutes</span>
        </h1>

        <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Fill a simple form per player. AI writes a warm, personalised progress report. Download polished PDFs ready to send to parents.
        </p>

        <Button
          size="lg"
          className="mt-8 text-base px-8 py-6 font-semibold shadow-lg shadow-primary/20"
          onClick={onStart}
        >
          Generate Reports
          <ArrowDown className="ml-2 h-5 w-5" />
        </Button>

        <p className="mt-4 text-xs text-muted-foreground">
          Cricket · Football · Badminton · Any Sport
        </p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
