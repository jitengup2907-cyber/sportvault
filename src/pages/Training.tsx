import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Plus, Calendar, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SPORT_NAMES, getSportConfig } from "@/types/sports";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BackButton from "@/components/BackButton";

const Training = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({
    date: new Date().toISOString().split("T")[0], duration: 60,
  });

  useEffect(() => { if (user) loadAcademy(); }, [user]);

  const loadAcademy = async () => {
    const { data } = await supabase.from("academies").select("id").limit(1).single();
    if (data) { setAcademyId(data.id); loadSessions(data.id); }
  };

  const loadSessions = async (aId: string) => {
    const { data } = await supabase.from("training_sessions").select("*").eq("academy_id", aId).order("session_date", { ascending: false });
    if (data) setSessions(data);
  };

  const addSession = async () => {
    if (!form.title || !form.sport) { toast.error("Fill title and sport"); return; }
    if (!academyId || !user) { toast.error("Create an academy first"); return; }
    const { error } = await supabase.from("training_sessions").insert({
      academy_id: academyId, coach_id: user.id,
      title: form.title, sport: form.sport,
      session_date: form.date, duration_minutes: form.duration,
      objectives: form.objectives || null, notes: form.notes || null,
      drills: form.drills ? [{ name: form.drills }] : [],
    });
    if (error) { toast.error(error.message); return; }
    setForm({ date: new Date().toISOString().split("T")[0], duration: 60 });
    setShowForm(false);
    toast.success("Session planned");
    loadSessions(academyId);
  };

  const sportConfig = form.sport ? getSportConfig(form.sport) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <BackButton />
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
              <Input placeholder="e.g. Speed & Agility Training" value={form.title || ""} onChange={(e) => setForm((f: any) => ({ ...f, title: e.target.value }))} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Sport *</label>
              <Select value={form.sport || ""} onValueChange={(v) => setForm((f: any) => ({ ...f, sport: v }))}>
                <SelectTrigger><SelectValue placeholder="Select sport..." /></SelectTrigger>
                <SelectContent>{SPORT_NAMES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Date</label>
              <Input type="date" value={form.date || ""} onChange={(e) => setForm((f: any) => ({ ...f, date: e.target.value }))} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Duration (minutes)</label>
              <Input type="number" value={form.duration || 60} onChange={(e) => setForm((f: any) => ({ ...f, duration: parseInt(e.target.value) || 60 }))} /></div>
            <div className="space-y-1.5 md:col-span-2"><label className="text-sm font-medium">Objectives</label>
              <Textarea placeholder={sportConfig ? `e.g. Improve ${sportConfig.tacticalTerms.slice(0,2).join(", ")}` : "Session objectives..."} value={form.objectives || ""} onChange={(e) => setForm((f: any) => ({ ...f, objectives: e.target.value }))} /></div>
            <div className="space-y-1.5 md:col-span-2"><label className="text-sm font-medium">Drills & Exercises</label>
              <Textarea placeholder={sportConfig ? `e.g. ${sportConfig.tacticalTerms.slice(0,3).join(" drill, ")} drill` : "List drills..."} value={form.drills || ""} onChange={(e) => setForm((f: any) => ({ ...f, drills: e.target.value }))} rows={3} /></div>
            <div className="space-y-1.5 md:col-span-2"><label className="text-sm font-medium">Notes</label>
              <Textarea placeholder="Any additional notes..." value={form.notes || ""} onChange={(e) => setForm((f: any) => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <Button onClick={addSession} className="w-full">Save Session</Button>
        </motion.div>
      )}

      {sessions.length === 0 && !showForm && (
        <div className="rounded-xl border-2 border-dashed bg-card p-12 text-center">
          <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold">No Sessions Planned</h3>
          <p className="text-muted-foreground text-sm">Click "Plan Session" to create training sessions.</p>
        </div>
      )}

      <div className="space-y-3">
        {sessions.map((s) => (
          <div key={s.id} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold">{s.title}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {s.session_date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {s.duration_minutes}min</span>
                </div>
              </div>
              <Badge variant="secondary">{s.sport}</Badge>
            </div>
            {s.objectives && <div className="mt-2 flex items-start gap-1.5"><Target className="h-4 w-4 text-primary mt-0.5 shrink-0" /><p className="text-sm">{s.objectives}</p></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Training;
