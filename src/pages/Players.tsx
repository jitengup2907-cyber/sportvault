import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, Users, Search, Edit2, Trash2 } from "lucide-react";
import { SPORT_NAMES, getSportConfig } from "@/types/sports";
import BackButton from "@/components/BackButton";

interface Player {
  id: string;
  name: string;
  age: number | null;
  sport: string;
  position: string | null;
  parent_email: string | null;
  parent_phone: string | null;
  notes: string | null;
  academy_id: string;
}

const Players = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [form, setForm] = useState({
    name: "", age: "", sport: "", position: "",
    parent_email: "", parent_phone: "", notes: "",
  });

  useEffect(() => {
    if (user) loadAcademy();
  }, [user]);

  const loadAcademy = async () => {
    const { data } = await supabase.from("academies").select("id").limit(1).single();
    if (data) {
      setAcademyId(data.id);
      loadPlayers(data.id);
    }
  };

  const loadPlayers = async (aId: string) => {
    const { data } = await supabase.from("players").select("*").eq("academy_id", aId).order("name");
    if (data) setPlayers(data);
  };

  const sportConfig = form.sport ? getSportConfig(form.sport) : null;

  const resetForm = () => {
    setForm({ name: "", age: "", sport: "", position: "", parent_email: "", parent_phone: "", notes: "" });
    setEditingPlayer(null);
  };

  const openEdit = (p: Player) => {
    setEditingPlayer(p);
    setForm({
      name: p.name, age: p.age?.toString() || "", sport: p.sport,
      position: p.position || "", parent_email: p.parent_email || "",
      parent_phone: p.parent_phone || "", notes: p.notes || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.sport) { toast.error("Name and sport are required"); return; }
    if (!academyId) { toast.error("Create an academy first"); return; }

    const payload = {
      name: form.name.trim(),
      age: form.age ? parseInt(form.age) : null,
      sport: form.sport,
      position: form.position || null,
      parent_email: form.parent_email || null,
      parent_phone: form.parent_phone || null,
      notes: form.notes || null,
      academy_id: academyId,
    };

    if (editingPlayer) {
      const { error } = await supabase.from("players").update(payload).eq("id", editingPlayer.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Player updated");
    } else {
      const { error } = await supabase.from("players").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Player added");
    }

    resetForm();
    setDialogOpen(false);
    loadPlayers(academyId);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("players").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Player removed");
    if (academyId) loadPlayers(academyId);
  };

  const filtered = players.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchSport = sportFilter === "all" || p.sport === sportFilter;
    return matchSearch && matchSport;
  });

  const sports = [...new Set(players.map(p => p.sport))];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <BackButton />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Player Roster</h1>
          <p className="text-muted-foreground">{players.length} player{players.length !== 1 ? "s" : ""} registered</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1.5" /> Add Player</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editingPlayer ? "Edit Player" : "Add Player"}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Name *</label>
                  <Input placeholder="Player name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Age</label>
                  <Input type="number" placeholder="Age" value={form.age} onChange={(e) => setForm(f => ({ ...f, age: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Sport *</label>
                  <Select value={form.sport} onValueChange={(v) => setForm(f => ({ ...f, sport: v, position: "" }))}>
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>{SPORT_NAMES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Position</label>
                  {sportConfig ? (
                    <Select value={form.position} onValueChange={(v) => setForm(f => ({ ...f, position: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>{sportConfig.positions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                  ) : (
                    <Input placeholder="Position" value={form.position} onChange={(e) => setForm(f => ({ ...f, position: e.target.value }))} />
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Parent Email</label>
                  <Input type="email" placeholder="parent@email.com" value={form.parent_email} onChange={(e) => setForm(f => ({ ...f, parent_email: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Parent Phone</label>
                  <Input placeholder="+91 ..." value={form.parent_phone} onChange={(e) => setForm(f => ({ ...f, parent_phone: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Notes</label>
                <Textarea placeholder="Any notes..." value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <Button onClick={handleSave} className="w-full">{editingPlayer ? "Update Player" : "Add Player"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search players..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        {sports.length > 1 && (
          <Select value={sportFilter} onValueChange={setSportFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {sports.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border-2 border-dashed bg-card p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold">No Players Found</h3>
          <p className="text-muted-foreground text-sm">Add players to your roster to start tracking.</p>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border bg-card p-4 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {p.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-sm">{p.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {p.age && <span>{p.age}y</span>}
                  {p.position && <span>· {p.position}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">{p.sport}</Badge>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Players;
