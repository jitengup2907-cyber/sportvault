import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { SPORT_NAMES } from "@/types/sports";

const CONTRACT_TYPES = [
  { value: "player", label: "Player Contract", desc: "Player-club agreement with terms, salary, and clauses" },
  { value: "coach", label: "Coach Employment", desc: "Coaching staff employment agreement" },
  { value: "sponsorship", label: "Sponsorship Deal", desc: "Brand sponsorship and partnership agreement" },
  { value: "transfer", label: "Transfer Agreement", desc: "Player transfer between clubs" },
  { value: "loan", label: "Loan Agreement", desc: "Temporary player loan arrangement" },
  { value: "trial", label: "Trial Agreement", desc: "Player trial period terms" },
];

const Contracts = () => {
  const [contractType, setContractType] = useState("");
  const [title, setTitle] = useState("");
  const [partyA, setPartyA] = useState("");
  const [partyB, setPartyB] = useState("");
  const [sport, setSport] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [salary, setSalary] = useState("");
  const [clauses, setClauses] = useState("");
  const [generatedContract, setGeneratedContract] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!contractType || !partyA || !partyB) {
      toast.error("Fill in contract type and both parties");
      return;
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) { toast.error("Backend not configured."); return; }

    setIsGenerating(true);
    try {
      const contractLabel = CONTRACT_TYPES.find(c => c.value === contractType)?.label || contractType;
      const systemPrompt = `You are a professional sports legal document drafter. Generate a comprehensive, professional ${contractLabel} for ${sport || "sports"}. Include all standard clauses, legal language, and proper formatting. Make it realistic and complete. Use proper legal terminology while keeping it readable.`;

      const userMessage = `Generate a ${contractLabel}:
Party A (Club/Organization): ${partyA}
Party B (Individual/Entity): ${partyB}
Sport: ${sport || "General Sports"}
Start Date: ${startDate || "TBD"}
End Date: ${endDate || "TBD"}
Compensation: ${salary || "To be negotiated"}
Additional Clauses/Terms: ${clauses || "Standard terms"}
Title: ${title || contractLabel}

Include: definitions, obligations, compensation details, termination clauses, confidentiality, dispute resolution, governing law, and signature blocks.`;

      const response = await fetch(`${supabaseUrl}/functions/v1/generate-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ systemPrompt, userMessage }),
      });

      if (!response.ok) throw new Error("Failed to generate contract");
      const data = await response.json();
      setGeneratedContract(data.reportText);
      toast.success("Contract generated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate contract");
    }
    setIsGenerating(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <h1 className="font-display text-3xl font-extrabold text-foreground mb-2">Contract Builder</h1>
      <p className="text-muted-foreground mb-8">Generate professional sports contracts with AI-powered legal drafting.</p>

      {/* Contract Type Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {CONTRACT_TYPES.map((ct) => (
          <button
            key={ct.value}
            onClick={() => setContractType(ct.value)}
            className={`rounded-xl border p-4 text-left transition-all ${
              contractType === ct.value ? "border-primary bg-primary/5 shadow-sm" : "bg-card hover:border-primary/30"
            }`}
          >
            <FileText className={`h-5 w-5 mb-2 ${contractType === ct.value ? "text-primary" : "text-muted-foreground"}`} />
            <h3 className="font-bold text-sm">{ct.label}</h3>
            <p className="text-xs text-muted-foreground">{ct.desc}</p>
          </button>
        ))}
      </div>

      {contractType && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-xl border bg-card p-5 md:p-6 shadow-sm space-y-4 mb-6">
            <h2 className="font-display text-xl font-bold">Contract Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Contract Title</label>
                <Input placeholder="e.g. Senior Player Agreement 2025" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Sport</label>
                <Select value={sport} onValueChange={setSport}>
                  <SelectTrigger><SelectValue placeholder="Select sport..." /></SelectTrigger>
                  <SelectContent>{SPORT_NAMES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Party A (Club/Organization) *</label>
                <Input placeholder="e.g. Manchester United FC" value={partyA} onChange={(e) => setPartyA(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Party B (Individual/Entity) *</label>
                <Input placeholder="e.g. John Smith" value={partyB} onChange={(e) => setPartyB(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Start Date</label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">End Date</label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium">Compensation / Salary</label>
                <Input placeholder="e.g. $50,000/year + performance bonuses" value={salary} onChange={(e) => setSalary(e.target.value)} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium">Additional Clauses / Special Terms</label>
                <Textarea placeholder="e.g. Release clause of $1M, image rights, non-compete clause..." value={clauses} onChange={(e) => setClauses(e.target.value)} rows={3} />
              </div>
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full shadow-lg shadow-primary/20 mb-6">
            {isGenerating ? "Generating Contract..." : "Generate Contract"}
          </Button>
        </motion.div>
      )}

      {generatedContract && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Generated Contract</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(generatedContract); toast.success("Copied!"); }}>
                Copy
              </Button>
            </div>
          </div>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">{generatedContract}</div>
        </motion.div>
      )}
    </div>
  );
};

export default Contracts;
