import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2, Download, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import PlayerForm from "@/components/PlayerForm";
import ReportCard from "@/components/ReportCard";
import LogoUpload from "@/components/LogoUpload";
import ComparisonView from "@/components/ComparisonView";
import TemplateSelector from "@/components/TemplateSelector";
import { PlayerData, AcademyInfo, GeneratedReport, ReportType, RATING_CATEGORIES } from "@/types/player";
import { ReportTone } from "@/types/template";
import { generateReport } from "@/lib/ai";
import { generateAllPDFs } from "@/lib/pdf";
import { saveReport, getPlayerHistory, getAllPlayerNames } from "@/lib/history";

function createEmptyPlayer(): PlayerData {
  const ratings: Record<string, number> = {};
  RATING_CATEGORIES.forEach((c) => { ratings[c.key] = 0; });
  return {
    id: crypto.randomUUID(),
    playerName: "", age: 0, sport: "", position: "",
    sessionsAttended: 0, totalSessions: 0, ratings,
    strengthNote: "", improvementNote: "", standoutMoment: "", goals: "",
  };
}

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function getDefaultPeriodLabel(type: ReportType): string {
  const now = new Date();
  return type === "monthly" ? `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}` : `${now.getFullYear() - 1}–${now.getFullYear()}`;
}

const PlayerReports = () => {
  const [players, setPlayers] = useState<PlayerData[]>([createEmptyPlayer()]);
  const [academy, setAcademy] = useState<AcademyInfo>({
    academyName: "", coachName: "", reportType: "monthly", periodLabel: getDefaultPeriodLabel("monthly"),
  });
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [selectedComparePlayer, setSelectedComparePlayer] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("classic-green");
  const [selectedTone, setSelectedTone] = useState<ReportTone>("encouraging");
  const reportsRef = useRef<HTMLDivElement>(null);

  const savedPlayerNames = getAllPlayerNames();

  const handlePlayerChange = useCallback((id: string, updates: Partial<PlayerData>) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const addPlayer = () => setPlayers((prev) => [...prev, createEmptyPlayer()]);
  const removePlayer = (id: string) => setPlayers((prev) => prev.filter((p) => p.id !== id));

  const handleReportTypeChange = (type: ReportType) => {
    setAcademy((a) => ({ ...a, reportType: type, periodLabel: getDefaultPeriodLabel(type) }));
  };

  const validate = (): boolean => {
    if (!academy.academyName.trim() || !academy.coachName.trim()) { toast.error("Please fill in Academy Name and Coach Name."); return false; }
    for (const p of players) {
      if (!p.playerName.trim() || !p.sport || !p.position.trim()) { toast.error(`Fill required fields for ${p.playerName || "a player"}.`); return false; }
      if (RATING_CATEGORIES.filter((c) => (p.ratings[c.key] || 0) > 0).length < 6) { toast.error(`Rate at least 6 categories for ${p.playerName}.`); return false; }
      if (!p.strengthNote.trim() || !p.improvementNote.trim()) { toast.error(`Add strength and improvement notes for ${p.playerName}.`); return false; }
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!validate()) return;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) { toast.error("Backend not configured."); return; }

    setIsGenerating(true); setReports([]); setProgress({ current: 0, total: players.length });
    const generated: GeneratedReport[] = [];

    for (let i = 0; i < players.length; i++) {
      try {
        setProgress({ current: i + 1, total: players.length });
        const reportText = await generateReport(players[i], academy, supabaseUrl, supabaseKey, selectedTone);
        const now = new Date().toISOString();
        generated.push({ player: players[i], reportText, generatedAt: now });
        saveReport({ periodLabel: academy.periodLabel, reportType: academy.reportType, academyName: academy.academyName, playerName: players[i].playerName, ratings: { ...players[i].ratings }, reportText, generatedAt: now });
      } catch (err) { console.error(err); toast.error(`Failed for ${players[i].playerName}`); }
    }

    setReports(generated); setIsGenerating(false);
    if (generated.length > 0) { toast.success(`${generated.length} report(s) generated!`); setTimeout(() => reportsRef.current?.scrollIntoView({ behavior: "smooth" }), 200); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <h1 className="font-display text-3xl font-extrabold text-foreground mb-2">Player Report Cards</h1>
      <p className="text-muted-foreground mb-8">Generate professional AI-powered progress reports for individual players.</p>

      {/* Academy Info */}
      <div className="rounded-xl border bg-card p-5 md:p-6 shadow-sm space-y-4 mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Academy & Report Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><label className="text-sm font-medium">Academy Name *</label><Input placeholder="e.g. Champions Cricket Academy" value={academy.academyName} onChange={(e) => setAcademy((a) => ({ ...a, academyName: e.target.value }))} /></div>
          <div className="space-y-1.5"><label className="text-sm font-medium">Coach Name *</label><Input placeholder="e.g. Coach Rajesh" value={academy.coachName} onChange={(e) => setAcademy((a) => ({ ...a, coachName: e.target.value }))} /></div>
          <div className="space-y-1.5"><label className="text-sm font-medium">Report Type</label>
            <Select value={academy.reportType} onValueChange={(v) => handleReportTypeChange(v as ReportType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly"><span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Monthly</span></SelectItem>
                <SelectItem value="annual"><span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Annual</span></SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><label className="text-sm font-medium">Period</label><Input value={academy.periodLabel} onChange={(e) => setAcademy((a) => ({ ...a, periodLabel: e.target.value }))} /></div>
        </div>
        <LogoUpload logoDataUrl={academy.logoDataUrl} onLogoChange={(url) => setAcademy((a) => ({ ...a, logoDataUrl: url }))} />
      </div>

      {/* Template & Tone */}
      <div className="rounded-xl border bg-card p-5 md:p-6 shadow-sm mb-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Template & Style</h2>
        <TemplateSelector selectedTemplate={selectedTemplate} selectedTone={selectedTone} onTemplateChange={setSelectedTemplate} onToneChange={setSelectedTone} />
      </div>

      {/* Player Forms */}
      <div className="space-y-5">
        {players.map((player, index) => (
          <PlayerForm key={player.id} player={player} index={index} onChange={handlePlayerChange} onRemove={removePlayer} canRemove={players.length > 1} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button variant="outline" onClick={addPlayer} className="flex-1"><Plus className="h-4 w-4 mr-1.5" /> Add Another Player</Button>
        <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1 shadow-lg shadow-primary/20">
          {isGenerating ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Generating {progress.current}/{progress.total}...</> : `Generate Reports`}
        </Button>
      </div>

      {/* Generated Reports */}
      {reports.length > 0 && (
        <motion.div ref={reportsRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold">Generated Reports ({reports.length})</h2>
            <Button onClick={() => generateAllPDFs(reports, academy, selectedTemplate)} className="shadow-lg shadow-primary/20">
              <Download className="h-4 w-4 mr-1.5" /> Download All PDFs
            </Button>
          </div>
          <div className="space-y-5">
            {reports.map((report) => (
              <ReportCard key={report.player.id} report={report} academy={academy} templateId={selectedTemplate} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Comparison */}
      {savedPlayerNames.length > 0 && (
        <div className="rounded-xl border bg-card p-5 md:p-6 shadow-sm mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Progress Comparison</h2>
            <Button variant="outline" size="sm" onClick={() => setShowComparison(!showComparison)}>{showComparison ? "Hide" : "Show"}</Button>
          </div>
          {showComparison && (
            <div className="space-y-4">
              <Select value={selectedComparePlayer} onValueChange={setSelectedComparePlayer}>
                <SelectTrigger><SelectValue placeholder="Choose a player..." /></SelectTrigger>
                <SelectContent>{savedPlayerNames.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent>
              </Select>
              {selectedComparePlayer && <ComparisonView playerName={selectedComparePlayer} history={getPlayerHistory(selectedComparePlayer)} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerReports;
