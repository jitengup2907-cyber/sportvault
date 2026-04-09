import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import HeroSection from "@/components/HeroSection";
import PlayerForm from "@/components/PlayerForm";
import ReportCard from "@/components/ReportCard";
import { PlayerData, AcademyInfo, GeneratedReport } from "@/types/player";
import { generateReport } from "@/lib/ai";
import { generateAllPDFs } from "@/lib/pdf";

function createEmptyPlayer(): PlayerData {
  return {
    id: crypto.randomUUID(),
    playerName: "",
    age: 0,
    sport: "",
    position: "",
    sessionsAttended: 0,
    totalSessions: 0,
    skillRating: 0,
    fitnessRating: 0,
    teamworkRating: 0,
    strengthNote: "",
    improvementNote: "",
    standoutMoment: "",
  };
}

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [players, setPlayers] = useState<PlayerData[]>([createEmptyPlayer()]);
  const [academy, setAcademy] = useState<AcademyInfo>({ academyName: "", coachName: "" });
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const formRef = useRef<HTMLDivElement>(null);
  const reportsRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handlePlayerChange = useCallback((id: string, field: keyof PlayerData, value: string | number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }, []);

  const addPlayer = () => setPlayers((prev) => [...prev, createEmptyPlayer()]);

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const validate = (): boolean => {
    if (!academy.academyName.trim() || !academy.coachName.trim()) {
      toast.error("Please fill in the Academy Name and Coach Name.");
      return false;
    }
    for (const p of players) {
      if (!p.playerName.trim() || !p.sport || !p.position.trim()) {
        toast.error(`Please fill in all required fields for ${p.playerName || "a player"}.`);
        return false;
      }
      if (p.skillRating === 0 || p.fitnessRating === 0 || p.teamworkRating === 0) {
        toast.error(`Please rate all skills for ${p.playerName || "a player"}.`);
        return false;
      }
      if (!p.strengthNote.trim() || !p.improvementNote.trim()) {
        toast.error(`Please add strength and improvement notes for ${p.playerName}.`);
        return false;
      }
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!validate()) return;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      toast.error("Backend not configured. Please enable Lovable Cloud.");
      return;
    }

    setIsGenerating(true);
    setReports([]);
    setProgress({ current: 0, total: players.length });

    const generated: GeneratedReport[] = [];

    for (let i = 0; i < players.length; i++) {
      try {
        setProgress({ current: i + 1, total: players.length });
        const reportText = await generateReport(players[i], academy, supabaseUrl, supabaseKey);
        generated.push({ player: players[i], reportText });
      } catch (err) {
        console.error(err);
        toast.error(`Failed to generate report for ${players[i].playerName}`);
      }
    }

    setReports(generated);
    setIsGenerating(false);

    if (generated.length > 0) {
      toast.success(`${generated.length} report(s) generated!`);
      setTimeout(() => reportsRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    }
  };

  const handleDownloadAll = () => {
    generateAllPDFs(reports, academy);
    toast.success("Downloading all PDFs...");
  };

  return (
    <div className="min-h-screen">
      <HeroSection onStart={handleStart} />

      <AnimatePresence>
        {showForm && (
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto px-4 pb-20"
          >
            {/* Academy Info */}
            <div className="rounded-xl border bg-card p-5 md:p-6 shadow-sm space-y-4 mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">Academy Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Academy Name</label>
                  <Input
                    placeholder="e.g. Champions Cricket Academy"
                    value={academy.academyName}
                    onChange={(e) => setAcademy((a) => ({ ...a, academyName: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Coach Name</label>
                  <Input
                    placeholder="e.g. Coach Rajesh"
                    value={academy.coachName}
                    onChange={(e) => setAcademy((a) => ({ ...a, coachName: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Player Forms */}
            <div className="space-y-5">
              {players.map((player, index) => (
                <PlayerForm
                  key={player.id}
                  player={player}
                  index={index}
                  onChange={handlePlayerChange}
                  onRemove={removePlayer}
                  canRemove={players.length > 1}
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button variant="outline" onClick={addPlayer} className="flex-1">
                <Plus className="h-4 w-4 mr-1.5" /> Add Another Player
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-1 shadow-lg shadow-primary/20"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    Generating {progress.current}/{progress.total}...
                  </>
                ) : (
                  "Generate Reports"
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reports Section */}
      {reports.length > 0 && (
        <motion.div
          ref={reportsRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl mx-auto px-4 pb-20"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Generated Reports ({reports.length})
            </h2>
            <Button onClick={handleDownloadAll} className="shadow-lg shadow-primary/20">
              <Download className="h-4 w-4 mr-1.5" /> Download All PDFs
            </Button>
          </div>
          <div className="space-y-5">
            {reports.map((report) => (
              <ReportCard key={report.player.id} report={report} academy={academy} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Index;
