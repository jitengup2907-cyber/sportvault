import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, Upload, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import MatchReportForm from "@/components/MatchReportForm";
import MatchReportCard from "@/components/MatchReportCard";
import TemplateSelector from "@/components/TemplateSelector";
import { MatchData, GeneratedMatchReport, createEmptyMatch } from "@/types/match";
import { ReportTone, REPORT_TEMPLATES } from "@/types/template";
import { generateMatchReport } from "@/lib/ai";
import { generateMatchPDF } from "@/lib/pdf";
import { generateMatchDocx } from "@/lib/docx";
import { supabase } from "@/integrations/supabase/client";
import BackButton from "@/components/BackButton";

const MatchReports = () => {
  const [match, setMatch] = useState<MatchData>(createEmptyMatch());
  const [coachName, setCoachName] = useState("");
  const [report, setReport] = useState<GeneratedMatchReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("classic-green");
  const [selectedTone, setSelectedTone] = useState<ReportTone>("direct");
  const [recordingFile, setRecordingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const template = REPORT_TEMPLATES.find((t) => t.id === selectedTemplate) || REPORT_TEMPLATES[0];

  const handleGenerate = async () => {
    if (!match.teamName.trim() || !match.opponentName.trim() || !match.sport) {
      toast.error("Fill in team names and sport."); return;
    }
    if (!match.keyPlayers.trim() || !match.tacticalNotes.trim()) {
      toast.error("Add key players and tactical notes."); return;
    }
    if (!coachName.trim()) { toast.error("Enter coach name."); return; }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) { toast.error("Backend not configured."); return; }

    setIsGenerating(true);
    try {
      const reportText = await generateMatchReport(match, coachName, supabaseUrl, supabaseKey, selectedTone);
      const generated: GeneratedMatchReport = { match, reportText, generatedAt: new Date().toISOString() };
      setReport(generated);
      toast.success("Match report generated!");
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate match report.");
    }
    setIsGenerating(false);
  };

  const handleRecordingUpload = async (file: File) => {
    setUploading(true);
    const path = `recordings/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("match-recordings").upload(path, file);
    if (error) { toast.error("Upload failed: " + error.message); }
    else { toast.success("Recording uploaded!"); setRecordingFile(file); }
    setUploading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <BackButton />
      <h1 className="font-display text-3xl font-extrabold text-foreground mb-2">Match Summary Reports</h1>
      <p className="text-muted-foreground mb-8">Generate AI-powered tactical match analysis for your coaching staff.</p>

      <div className="rounded-xl border bg-card p-5 md:p-6 shadow-sm mb-6">
        <div className="space-y-1.5 max-w-sm">
          <label className="text-sm font-medium">Coach Name *</label>
          <Input placeholder="e.g. Coach Rajesh" value={coachName} onChange={(e) => setCoachName(e.target.value)} />
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 md:p-6 shadow-sm mb-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Template & Style</h2>
        <TemplateSelector selectedTemplate={selectedTemplate} selectedTone={selectedTone} onTemplateChange={setSelectedTemplate} onToneChange={setSelectedTone} />
      </div>

      <MatchReportForm match={match} onChange={(updates) => setMatch((prev) => ({ ...prev, ...updates }))} />

      <div className="mt-6">
        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full shadow-lg shadow-primary/20">
          {isGenerating ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Generating Tactical Report...</> : "Generate Match Report"}
        </Button>
      </div>

      {report && (
        <motion.div ref={reportRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
          <h2 className="font-display text-2xl font-bold mb-6">Generated Report</h2>
          <MatchReportCard
            report={report}
            coachName={coachName}
            template={template}
            onDownloadPDF={() => generateMatchPDF(report, coachName, selectedTemplate)}
            onDownloadDocx={() => generateMatchDocx(report, coachName, selectedTemplate)}
          />
        </motion.div>
      )}
    </div>
  );
};

export default MatchReports;
