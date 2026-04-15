import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SPORT_NAMES } from "@/types/sports";

const DEMO_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-report`;

const LiveDemo = () => {
  const navigate = useNavigate();
  const [sport, setSport] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [strength, setStrength] = useState("");
  const [improvement, setImprovement] = useState("");
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState("");

  const handleGenerate = async () => {
    if (!sport || !playerName.trim() || !strength.trim() || !improvement.trim()) return;
    setGenerating(true);
    setReport("");

    try {
      const resp = await fetch(DEMO_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          systemPrompt: `You are an expert ${sport} coach writing a brief, encouraging player progress report card. Keep it to 150 words max. Use sport-specific terminology for ${sport}. Format with clear sections: Overview, Strengths, Areas for Improvement, and Coach's Note.`,
          userMessage: `Write a sample monthly progress report for ${playerName}, a ${sport} player.\n\nKey Strength: ${strength}\nArea to Improve: ${improvement}\n\nMake it professional, encouraging, and sport-specific.`,
        }),
      });

      if (!resp.ok) throw new Error("Failed");
      const data = await resp.json();
      setReport(data.reportText);
    } catch {
      setReport("Unable to generate demo report right now. Sign up to try the full experience!");
    }
    setGenerating(false);
  };

  return (
    <section className="py-16 px-4" id="demo">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-extrabold text-foreground">
            Try it right now — no signup needed
          </h2>
          <p className="text-muted-foreground mt-2">Generate a sample player report card in seconds</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Sport</label>
              <Select value={sport} onValueChange={setSport}>
                <SelectTrigger><SelectValue placeholder="Pick a sport..." /></SelectTrigger>
                <SelectContent>{SPORT_NAMES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Player Name</label>
              <Input placeholder="e.g. Arjun Patel" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">One Strength</label>
              <Input placeholder="e.g. Excellent footwork" value={strength} onChange={(e) => setStrength(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">One Improvement Area</label>
              <Input placeholder="e.g. Defensive positioning" value={improvement} onChange={(e) => setImprovement(e.target.value)} />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || !sport || !playerName.trim() || !strength.trim() || !improvement.trim()}
            className="w-full shadow-lg shadow-primary/20"
          >
            {generating ? (
              <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Generating Sample Report...</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-1.5" /> Generate Sample Report →</>
            )}
          </Button>
        </div>

        {report && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-foreground">{playerName}'s Report — {sport}</span>
              </div>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground text-sm">
                {report}
              </div>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground mb-3">
                Want to save this and send it to parents?
              </p>
              <Button onClick={() => navigate("/auth")} className="shadow-lg shadow-primary/20">
                Create your free account <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default LiveDemo;
