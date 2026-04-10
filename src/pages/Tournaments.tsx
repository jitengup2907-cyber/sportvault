import { useState } from "react";
import { Trophy, Plus, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SPORT_NAMES } from "@/types/sports";
import { motion } from "framer-motion";

interface Tournament {
  id: string;
  name: string;
  sport: string;
  location: string;
  startDate: string;
  endDate: string;
  format: string;
  status: string;
}

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Tournament>>({ status: "upcoming", format: "knockout" });

  const addTournament = () => {
    if (!form.name || !form.sport || !form.startDate) { toast.error("Fill name, sport, and start date"); return; }
    setTournaments(prev => [{
      id: crypto.randomUUID(),
      name: form.name || "", sport: form.sport || "", location: form.location || "",
      startDate: form.startDate || "", endDate: form.endDate || "",
      format: form.format || "knockout", status: form.status || "upcoming",
    }, ...prev]);
    setForm({ status: "upcoming", format: "knockout" });
    setShowForm(false);
    toast.success("Tournament created");
  };

  const statusColor = (s: string) => {
    if (s === "ongoing") return "bg-emerald-100 text-emerald-700";
    if (s === "completed") return "bg-muted text-muted-foreground";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
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
              <Input placeholder="e.g. Spring Cup 2025" value={form.name || ""} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Sport *</label>
              <Select value={form.sport || ""} onValueChange={(v) => setForm(f => ({ ...f, sport: v }))}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>{SPORT_NAMES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Location</label>
              <Input placeholder="Venue name" value={form.location || ""} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Format</label>
              <Select value={form.format} onValueChange={(v) => setForm(f => ({ ...f, format: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="knockout">Knockout</SelectItem>
                  <SelectItem value="league">League</SelectItem>
                  <SelectItem value="group+knockout">Group + Knockout</SelectItem>
                  <SelectItem value="round-robin">Round Robin</SelectItem>
                </SelectContent>
              </Select></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Start Date *</label>
              <Input type="date" value={form.startDate || ""} onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">End Date</label>
              <Input type="date" value={form.endDate || ""} onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))} /></div>
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
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {t.startDate}{t.endDate && ` – ${t.endDate}`}</span>
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
