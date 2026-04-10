import { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Plus, Calendar, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SPORT_NAMES, getSportConfig } from "@/types/sports";

interface TrainingSession {
  id: string;
  title: string;
  sport: string;
  date: string;
  duration: number;
  objectives: string;
  drills: string;
  notes: string;
}

const Training = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<TrainingSession>>({
    date: new Date().toISOString().split("T")[0],
    duration: 60,
  });

  const addSession = () => {
    if (!form.title || !form.sport) { toast.error("Fill title and sport"); return; }
    const session: TrainingSession = {
      id: crypto.randomUUID(),
      title: form.title || "",
      sport: form.sport || "",
      date: form.date || "",
      duration: form.duration || 60,
      objectives: form.objectives || "",
      drills: form.drills || "",
      notes: form.notes || "",
    };
    setSessions((prev) => [session, ...prev]);
    setForm({ date: new Date().toISOString().split("T")[0], duration: 60 });
    setShowForm(false);
    toast.success("Session planned");
  };

  const sportConfig = form.sport ? getSportConfig(form.sport) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Training Sessions</h1>
          <p className="text-muted-foreground">Plan sessions with drills, objectives, and attendance.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1.5" /> Plan Session</Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-5 shadow-sm mb-6 space-y-4">
          <h2 className="font-display text-lg font-bold">New Training Session</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="text-sm font-medium">Session Title *</label>
              <Input placeholder="e.g. Speed & Agility Training" value={form.title || ""} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Sport *</label>
              <Select value={form.sport || ""} onValueChange={(v) => setForm(f => ({ ...f, sport: v }))}>
                <SelectTrigger><SelectValue placeholder="Select sport..." /></SelectTrigger>
                <SelectContent>{SPORT_NAMES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Date</label>
              <Input type="date" value={form.date || ""} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Duration (minutes)</label>
              <Input type="number" value={form.duration || 60} onChange={(e) => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 60 }))} /></div>
            <div className="space-y-1.5 md:col-span-2"><label className="text-sm font-medium">Objectives</label>
              <Textarea placeholder={sportConfig ? `e.g. Improve ${sportConfig.tacticalTerms.slice(0,2).join(", ")}` : "Session objectives..."} value={form.objectives || ""} onChange={(e) => setForm(f => ({ ...f, objectives: e.target.value }))} /></div>
            <div className="space-y-1.5 md:col-span-2"><label className="text-sm font-medium">Drills & Exercises</label>
              <Textarea placeholder={sportConfig ? `e.g. ${sportConfig.tacticalTerms.slice(0,3).join(" drill, ")} drill` : "List drills..."} value={form.drills || ""} onChange={(e) => setForm(f => ({ ...f, drills: e.target.value }))} rows={3} /></div>
            <div className="space-y-1.5 md:col-span-2"><label className="text-sm font-medium">Notes</label>
              <Textarea placeholder="Any additional notes..." value={form.notes || ""} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <Button onClick={addSession} className="w-full">Save Session</Button>
        </motion.div>
      )}

      {sessions.length === 0 && !showForm && (
        <div className="rounded-xl border-2 border-dashed bg-card p-12 text-center">
          <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold">No Sessions Planned</h3>
          <p className="text-muted-foreground text-sm">Click "Plan Session" to create training sessions with drills and objectives.</p>
        </div>
      )}

      <div className="space-y-3">
        {sessions.map((s) => (
          <div key={s.id} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold">{s.title}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {s.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {s.duration}min</span>
                </div>
              </div>
              <Badge variant="secondary">{s.sport}</Badge>
            </div>
            {s.objectives && <div className="mt-2 flex items-start gap-1.5"><Target className="h-4 w-4 text-primary mt-0.5 shrink-0" /><p className="text-sm">{s.objectives}</p></div>}
            {s.drills && <p className="text-sm text-muted-foreground mt-1">{s.drills}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Training;
