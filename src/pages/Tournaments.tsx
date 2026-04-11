import { useState, useEffect } from "react";
import { Trophy, Plus, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SPORT_NAMES } from "@/types/sports";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BackButton from "@/components/BackButton";

const Tournaments = () => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({ status: "upcoming", format: "knockout" });

  useEffect(() => { if (user) loadAcademy(); }, [user]);

  const loadAcademy = async () => {
    const { data } = await supabase.from("academies").select("id").limit(1).single();
    if (data) { setAcademyId(data.id); loadTournaments(data.id); }
  };

  const loadTournaments = async (aId: string) => {
    const { data } = await supabase.from("tournaments").select("*").eq("academy_id", aId).order("start_date", { ascending: false });
    if (data) setTournaments(data);
  };

  const addTournament = async () => {
    if (!form.name || !form.sport || !form.startDate) { toast.error("Fill name, sport, and start date"); return; }
    if (!academyId || !user) { toast.error("Create an academy first"); return; }
    const { error } = await supabase.from("tournaments").insert({
      academy_id: academyId, created_by: user.id,
      name: form.name, sport: form.sport, location: form.location || null,
      start_date: form.startDate, end_date: form.endDate || null,
      format: form.format, status: form.status,
    });
    if (error) { toast.error(error.message); return; }
    setForm({ status: "upcoming", format: "knockout" });
    setShowForm(false);
    toast.success("Tournament created");
    loadTournaments(academyId);
  };

  const statusColor = (s: string) => {
    if (s === "ongoing") return "bg-emerald-100 text-emerald-700";
    if (s === "completed") return "bg-muted text-muted-foreground";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <BackButton />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Tournaments</h1>
          <p className="text-muted-foreground">Manage fixtures, standings, and results.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1.5" /> New Tournament</Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-5 shadow-sm mb-6 space-y-4">
          <h2 className="font-display text-lg font-bold">New Tournament</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="text-sm font-medium">Tournament Name *</label>
              <Input placeholder="e.g. Spring Cup 2025" value={form.name || ""} onChange={(e) => setForm((f: any) => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Sport *</label>
              <Select value={form.sport || ""} onValueChange={(v) => setForm((f: any) => ({ ...f, sport: v }))}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>{SPORT_NAMES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Location</label>
              <Input placeholder="Venue name" value={form.location || ""} onChange={(e) => setForm((f: any) => ({ ...f, location: e.target.value }))} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Format</label>
              <Select value={form.format} onValueChange={(v) => setForm((f: any) => ({ ...f, format: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="knockout">Knockout</SelectItem>
                  <SelectItem value="league">League</SelectItem>
                  <SelectItem value="group+knockout">Group + Knockout</SelectItem>
                  <SelectItem value="round-robin">Round Robin</SelectItem>
                </SelectContent>
              </Select></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Start Date *</label>
              <Input type="date" value={form.startDate || ""} onChange={(e) => setForm((f: any) => ({ ...f, startDate: e.target.value }))} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">End Date</label>
              <Input type="date" value={form.endDate || ""} onChange={(e) => setForm((f: any) => ({ ...f, endDate: e.target.value }))} /></div>
          </div>
          <Button onClick={addTournament} className="w-full">Create Tournament</Button>
        </motion.div>
      )}

      {tournaments.length === 0 && !showForm && (
        <div className="rounded-xl border-2 border-dashed bg-card p-12 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold">No Tournaments</h3>
          <p className="text-muted-foreground text-sm">Create a tournament to track fixtures and results.</p>
        </div>
      )}

      <div className="space-y-3">
        {tournaments.map((t) => (
          <div key={t.id} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold">{t.name}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {t.start_date}{t.end_date && ` – ${t.end_date}`}</span>
                  {t.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {t.location}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{t.format}</Badge>
                <Badge className={statusColor(t.status)}>{t.status}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tournaments;
