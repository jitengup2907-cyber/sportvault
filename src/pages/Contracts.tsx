import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { SPORT_NAMES } from "@/types/sports";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BackButton from "@/components/BackButton";
import jsPDF from "jspdf";

const CONTRACT_TYPES = [
  { value: "player", label: "Player Contract", desc: "Player-club agreement with terms, salary, and clauses" },
  { value: "coach", label: "Coach Employment", desc: "Coaching staff employment agreement" },
  { value: "sponsorship", label: "Sponsorship Deal", desc: "Brand sponsorship and partnership agreement" },
  { value: "transfer", label: "Transfer Agreement", desc: "Player transfer between clubs" },
  { value: "loan", label: "Loan Agreement", desc: "Temporary player loan arrangement" },
  { value: "trial", label: "Trial Agreement", desc: "Player trial period terms" },
];

const Contracts = () => {
  const { user } = useAuth();
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [savedContracts, setSavedContracts] = useState<any[]>([]);
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

  useEffect(() => { if (user) loadAcademy(); }, [user]);

  const loadAcademy = async () => {
    const { data } = await supabase.from("academies").select("id").limit(1).single();
    if (data) { setAcademyId(data.id); loadContracts(data.id); }
  };

  const loadContracts = async (aId: string) => {
    const { data } = await supabase.from("contracts").select("*").eq("academy_id", aId).order("created_at", { ascending: false });
    if (data) setSavedContracts(data);
  };

  const handleGenerate = async () => {
    if (!contractType || !partyA || !partyB) { toast.error("Fill in contract type and both parties"); return; }
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !supabaseKey) { toast.error("Backend not configured."); return; }

    setIsGenerating(true);
    try {
      const contractLabel = CONTRACT_TYPES.find(c => c.value === contractType)?.label || contractType;
      const systemPrompt = `You are a professional sports legal document drafter. Generate a comprehensive, professional ${contractLabel} for ${sport || "sports"}. Include all standard clauses, legal language, and proper formatting.`;
      const userMessage = `Generate a ${contractLabel}:\nParty A: ${partyA}\nParty B: ${partyB}\nSport: ${sport || "General"}\nStart: ${startDate || "TBD"}\nEnd: ${endDate || "TBD"}\nCompensation: ${salary || "TBD"}\nClauses: ${clauses || "Standard"}\nTitle: ${title || contractLabel}\n\nInclude: definitions, obligations, compensation, termination, confidentiality, dispute resolution, governing law, and signature blocks.`;

      const response = await fetch(`${supabaseUrl}/functions/v1/generate-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({ systemPrompt, userMessage }),
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setGeneratedContract(data.reportText);

      // Save to DB
      if (academyId && user) {
        await supabase.from("contracts").insert({
          academy_id: academyId, created_by: user.id,
          contract_type: contractType, title: title || contractLabel,
          party_a: partyA, party_b: partyB, sport: sport || null,
          start_date: startDate || null, end_date: endDate || null,
          salary_amount: salary ? parseFloat(salary.replace(/[^0-9.]/g, "")) : null,
          clauses: clauses || null, contract_text: data.reportText,
        });
        loadContracts(academyId);
      }
      toast.success("Contract generated & saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate contract");
    }
    setIsGenerating(false);
  };

  const exportPDF = (text: string, pTitle: string) => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text(pTitle, 20, 20);
    pdf.setFontSize(10);
    const lines = pdf.splitTextToSize(text, 170);
    let y = 35;
    for (const line of lines) {
      if (y > 280) { pdf.addPage(); y = 20; }
      pdf.text(line, 20, y);
      y += 5;
    }
    pdf.save(`${pTitle.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <BackButton />
      <h1 className="font-display text-3xl font-extrabold text-foreground mb-2">Contract Builder</h1>
      <p className="text-muted-foreground mb-8">Generate professional sports contracts with AI-powered legal drafting.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {CONTRACT_TYPES.map((ct) => (
          <button key={ct.value} onClick={() => setContractType(ct.value)}
            className={`rounded-xl border p-4 text-left transition-all ${contractType === ct.value ? "border-primary bg-primary/5 shadow-sm" : "bg-card hover:border-primary/30"}`}>
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
              <div className="space-y-1.5"><label className="text-sm font-medium">Contract Title</label>
                <Input placeholder="e.g. Senior Player Agreement 2025" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">Sport</label>
                <Select value={sport} onValueChange={setSport}>
                  <SelectTrigger><SelectValue placeholder="Select sport..." /></SelectTrigger>
                  <SelectContent>{SPORT_NAMES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">Party A (Club/Organization) *</label>
                <Input placeholder="e.g. Manchester United FC" value={partyA} onChange={(e) => setPartyA(e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">Party B (Individual/Entity) *</label>
                <Input placeholder="e.g. John Smith" value={partyB} onChange={(e) => setPartyB(e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">Start Date</label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
              <div className="space-y-1.5"><label className="text-sm font-medium">End Date</label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
              <div className="space-y-1.5 md:col-span-2"><label className="text-sm font-medium">Compensation / Salary</label>
                <Input placeholder="e.g. $50,000/year" value={salary} onChange={(e) => setSalary(e.target.value)} /></div>
              <div className="space-y-1.5 md:col-span-2"><label className="text-sm font-medium">Additional Clauses</label>
                <Textarea placeholder="e.g. Release clause, image rights..." value={clauses} onChange={(e) => setClauses(e.target.value)} rows={3} /></div>
            </div>
          </div>
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full shadow-lg shadow-primary/20 mb-6">
            {isGenerating ? "Generating Contract..." : "Generate Contract"}
          </Button>
        </motion.div>
      )}

      {generatedContract && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border bg-card p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Generated Contract</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(generatedContract); toast.success("Copied!"); }}>
                <Copy className="h-3.5 w-3.5 mr-1" /> Copy
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportPDF(generatedContract, title || "Contract")}>
                <Download className="h-3.5 w-3.5 mr-1" /> PDF
              </Button>
            </div>
          </div>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">{generatedContract}</div>
        </motion.div>
      )}

      {/* Saved Contracts */}
      {savedContracts.length > 0 && (
        <div>
          <h2 className="font-display text-xl font-bold mb-4">Saved Contracts ({savedContracts.length})</h2>
          <div className="space-y-3">
            {savedContracts.map((c) => (
              <div key={c.id} className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm">{c.title}</h3>
                    <p className="text-xs text-muted-foreground">{c.party_a} ↔ {c.party_b} · {c.contract_type}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setGeneratedContract(c.contract_text || "")}>View</Button>
                    <Button variant="ghost" size="sm" onClick={() => exportPDF(c.contract_text || "", c.title)}>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;
