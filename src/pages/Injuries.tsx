import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, Plus, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SPORT_NAMES } from "@/types/sports";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BackButton from "@/components/BackButton";

const Injuries = () => {
  const { user } = useAuth();
  const [injuries, setInjuries] = useState<any[]>([]);
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({
    severity: "moderate", status: "active",
    injuryDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => { if (user) loadAcademy(); }, [user]);

  const loadAcademy = async () => {
    const { data } = await supabase.from("academies").select("id").limit(1).single();
    if (data) { setAcademyId(data.id); loadInjuries(data.id); }
  };

  const loadInjuries = async (aId: string) => {
    const { data } = await supabase.from("injuries").select("*").eq("academy_id", aId).order("created_at", { ascending: false });
    if (data) setInjuries(data);
  };

  const addInjury = async () => {
    if (!form.playerName || !form.injuryType) { toast.error("Fill player name and injury type"); return; }
    if (!academyId || !user) { toast.error("Create an academy first"); return; }
    const { error } = await supabase.from("injuries").insert({
      academy_id: academyId, created_by: user.id,
      player_name: form.playerName, sport: form.sport || null,
      injury_type: form.injuryType, body_part: form.bodyPart || null,
      severity: form.severity, injury_date: form.injuryDate,
      expected_return: form.expectedReturn || null,
      treatment_notes: form.treatmentNotes || null, status: form.status,
    });
    if (error) { toast.error(error.message); return; }
    setForm({ severity: "moderate", status: "active", injuryDate: new Date().toISOString().split("T")[0] });
    setShowForm(false);
    toast.success("Injury logged");
    loadInjuries(academyId);
  };

  const statusIcon = (status: string) => {
    if (status === "active") return <AlertCircle className="h-4 w-4 text-destructive" />;
    if (status === "recovering") return <Clock className="h-4 w-4 text-amber-500" />;
    return <CheckCircle className="h-4 w-4 text-emerald-500" />;
  };

  const severityColor = (s: string) => {
    if (s === "minor") return "bg-emerald-100 text-emerald-700";
    if (s === "severe") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <BackButton />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Injury Tracker</h1>
          <p className="text-muted-foreground">Log injuries, track recovery, manage medical clearances.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1.5" /> Log Injury</Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-5 shadow-sm mb-6 space-y-4">
          <h2 className="font-display text-lg font-bold">New Injury Record</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="text-sm font-medium">Player Name *</label>
              <Input placeholder="Player name" value={form.playerName || ""} onChange={(e) => setForm((f: any) => ({ ...f, playerName: e.target.value }))} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Sport</label>
              <Select value={form.sport || ""} onValueChange={(v) => setForm((f: any) => ({ ...f, sport: v }))}>
                <SelectTrigger><SelectValue placeholder="Select sport..." /></SelectTrigger>
                <SelectContent>{SPORT_NAMES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Injury Type *</label>
              <Input placeholder="e.g. ACL Tear" value={form.injuryType || ""} onChange={(e) => setForm((f: any) => ({ ...f, injuryType: e.target.value }))} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Body Part</label>
              <Input placeholder="e.g. Left Knee" value={form.bodyPart || ""} onChange={(e) => setForm((f: any) => ({ ...f, bodyPart: e.target.value }))} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Severity</label>
              <Select value={form.severity} onValueChange={(v) => setForm((f: any) => ({ ...f, severity: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor">Minor</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Injury Date</label>
              <Input type="date" value={form.injuryDate || ""} onChange={(e) => setForm((f: any) => ({ ...f, injuryDate: e.target.value }))} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Expected Return</label>
              <Input type="date" value={form.expectedReturn || ""} onChange={(e) => setForm((f: any) => ({ ...f, expectedReturn: e.target.value }))} /></div>
            <div className="space-y-1.5 md:col-span-2"><label className="text-sm font-medium">Treatment Notes</label>
              <Textarea placeholder="Treatment plan..." value={form.treatmentNotes || ""} onChange={(e) => setForm((f: any) => ({ ...f, treatmentNotes: e.target.value }))} /></div>
          </div>
          <Button onClick={addInjury} className="w-full">Save Injury Record</Button>
        </motion.div>
      )}

      {injuries.length === 0 && !showForm && (
        <div className="rounded-xl border-2 border-dashed bg-card p-12 text-center">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold">No Injuries Logged</h3>
          <p className="text-muted-foreground text-sm">Click "Log Injury" to record player injuries and track recovery.</p>
        </div>
      )}

      <div className="space-y-3">
        {injuries.map((inj) => (
          <div key={inj.id} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {statusIcon(inj.status)}
                <div>
                  <h3 className="font-bold">{inj.player_name}</h3>
                  <p className="text-sm text-muted-foreground">{inj.injury_type} — {inj.body_part}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={severityColor(inj.severity)}>{inj.severity}</Badge>
                <span className="text-xs text-muted-foreground">{inj.injury_date}</span>
              </div>
            </div>
            {inj.treatment_notes && <p className="text-sm text-muted-foreground mt-2">{inj.treatment_notes}</p>}
            {inj.expected_return && <p className="text-xs text-muted-foreground mt-1">Expected return: {inj.expected_return}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Injuries;
