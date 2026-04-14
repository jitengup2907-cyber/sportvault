import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2, Upload, Video, Plus, Trash2, Clock, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePlan } from "@/hooks/usePlan";
import UpgradeModal from "@/components/UpgradeModal";
import BackButton from "@/components/BackButton";
import { SPORT_NAMES } from "@/types/sports";

interface ClipDescription {
  id: string;
  timestamp: string;
  description: string;
}

const ANALYZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-video`;

const VideoAnalysis = () => {
  const { plan } = usePlan();
  const [sport, setSport] = useState("");
  const [teamName, setTeamName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [matchDate, setMatchDate] = useState(new Date().toISOString().split("T")[0]);
  const [formation, setFormation] = useState("");
  const [result, setResult] = useState("");
  const [manualNotes, setManualNotes] = useState("");
  const [clips, setClips] = useState<ClipDescription[]>([
    { id: crypto.randomUUID(), timestamp: "", description: "" },
  ]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState("");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const isPro = plan === "pro";

  const addClip = () => {
    setClips((prev) => [...prev, { id: crypto.randomUUID(), timestamp: "", description: "" }]);
  };

  const removeClip = (id: string) => {
    setClips((prev) => prev.filter((c) => c.id !== id));
  };

  const updateClip = (id: string, field: "timestamp" | "description", value: string) => {
    setClips((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleVideoUpload = async (file: File) => {
    if (!isPro) {
      setUpgradeOpen(true);
      return;
    }
    setUploading(true);
    const path = `analysis/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from("match-recordings").upload(path, file);
    if (error) {
      toast.error("Upload failed: " + error.message);
    } else {
      toast.success("Video uploaded!");
      setVideoFile(file);
    }
    setUploading(false);
  };

  const handleAnalyze = async () => {
    if (!isPro) {
      setUpgradeOpen(true);
      return;
    }
    if (!sport || !teamName.trim() || !opponentName.trim()) {
      toast.error("Fill in sport, team name, and opponent name.");
      return;
    }
    const validClips = clips.filter((c) => c.description.trim());
    if (validClips.length === 0 && !manualNotes.trim()) {
      toast.error("Add at least one clip description or manual notes.");
      return;
    }

    setAnalyzing(true);
    setAnalysisReport("");

    try {
      const resp = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          sport,
          teamName,
          opponentName,
          matchDate,
          formation,
          result,
          manualNotes,
          clipDescriptions: validClips.map((c) => ({
            timestamp: c.timestamp,
            description: c.description,
          })),
        }),
      });

      if (!resp.ok || !resp.body) throw new Error("Analysis failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setAnalysisReport(fullText);
            }
          } catch { /* partial */ }
        }
      }

      toast.success("Analysis complete!");
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate analysis.");
    }
    setAnalyzing(false);
  };

  if (!isPro) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
        <BackButton />
        <div className="rounded-xl border-2 border-dashed bg-card p-12 text-center">
          <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-2xl font-extrabold text-foreground mb-2">AI Video Analysis</h1>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Upload match clips, tag key moments, and get AI-powered tactical analysis reports. Available exclusively on the Pro Analyst plan.
          </p>
          <Button onClick={() => setUpgradeOpen(true)} className="shadow-lg shadow-primary/20">
            Upgrade to Pro — ₹1,999/mo
          </Button>
          <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} message="AI Video Analysis is a Pro Analyst feature." />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <BackButton />
      <h1 className="font-display text-3xl font-extrabold text-foreground mb-2">AI Video Analysis</h1>
      <p className="text-muted-foreground mb-8">Upload match footage, tag key moments, and generate tactical analysis reports.</p>

      {/* Video Upload */}
      <div className="rounded-xl border bg-card p-5 md:p-6 shadow-sm mb-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" /> Match Footage
        </h2>
        <p className="text-xs text-muted-foreground mb-3">Upload match video (MP4, MOV, AVI — up to 5GB per upload)</p>
        <label className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer hover:border-primary/50 transition-colors">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {uploading ? "Uploading..." : videoFile ? videoFile.name : "Click to upload match video"}
          </span>
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleVideoUpload(f); }}
          />
        </label>
      </div>

      {/* Match Details */}
      <div className="rounded-xl border bg-card p-5 md:p-6 shadow-sm mb-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-4">Match Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Sport *</label>
            <Select value={sport} onValueChange={setSport}>
              <SelectTrigger><SelectValue placeholder="Select sport" /></SelectTrigger>
              <SelectContent>{SPORT_NAMES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Match Date</label>
            <Input type="date" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Your Team *</label>
            <Input placeholder="e.g. Mumbai Strikers" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Opponent *</label>
            <Input placeholder="e.g. Delhi Dynamos" value={opponentName} onChange={(e) => setOpponentName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Formation/Setup</label>
            <Input placeholder="e.g. 4-3-3, 3-5-2" value={formation} onChange={(e) => setFormation(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Result</label>
            <Select value={result} onValueChange={setResult}>
              <SelectTrigger><SelectValue placeholder="Select result" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="win">Win</SelectItem>
                <SelectItem value="loss">Loss</SelectItem>
                <SelectItem value="draw">Draw</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Key Moments / Clip Descriptions */}
      <div className="rounded-xl border bg-card p-5 md:p-6 shadow-sm mb-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-2 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" /> Key Moments & Clip Descriptions
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Describe key moments from the match. Add timestamps if you have video, or just describe what happened.
        </p>

        <div className="space-y-3">
          {clips.map((clip, i) => (
            <div key={clip.id} className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {i + 1}
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Timestamp (e.g. 23:15, 2nd Half 10min)"
                  value={clip.timestamp}
                  onChange={(e) => updateClip(clip.id, "timestamp", e.target.value)}
                  className="text-sm"
                />
                <Textarea
                  placeholder="Describe what happened — e.g. 'Counter-attack from left flank, midfielder through-ball to striker, shot saved by keeper'"
                  value={clip.description}
                  onChange={(e) => updateClip(clip.id, "description", e.target.value)}
                  rows={2}
                  className="text-sm"
                />
              </div>
              {clips.length > 1 && (
                <Button size="icon" variant="ghost" className="flex-shrink-0 mt-1" onClick={() => removeClip(clip.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button variant="outline" size="sm" className="mt-3" onClick={addClip}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Another Moment
        </Button>
      </div>

      {/* Manual Notes */}
      <div className="rounded-xl border bg-card p-5 md:p-6 shadow-sm mb-6">
        <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> Coach's Notes
        </h2>
        <Textarea
          placeholder="Add any additional observations, tactical notes, player feedback, or areas you want the analysis to focus on..."
          value={manualNotes}
          onChange={(e) => setManualNotes(e.target.value)}
          rows={4}
        />
      </div>

      {/* Analyze Button */}
      <Button onClick={handleAnalyze} disabled={analyzing} className="w-full shadow-lg shadow-primary/20">
        {analyzing ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Generating Tactical Analysis...</> : "Generate AI Analysis Report"}
      </Button>

      {/* Analysis Report */}
      {analysisReport && (
        <motion.div ref={reportRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
          <h2 className="font-display text-2xl font-bold mb-4">Tactical Analysis Report</h2>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span className="font-semibold text-foreground">{teamName} vs {opponentName}</span>
              <span>·</span>
              <span>{sport}</span>
              <span>·</span>
              <span>{matchDate}</span>
            </div>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
              {analysisReport}
            </div>
          </div>
        </motion.div>
      )}

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} message="AI Video Analysis is a Pro Analyst feature." />
    </div>
  );
};

export default VideoAnalysis;
