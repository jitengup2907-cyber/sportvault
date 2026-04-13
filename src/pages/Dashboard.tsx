import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ClipboardList, Swords, FileText, Activity, Dumbbell,
  Trophy, DollarSign, ArrowRight, Plus, Building2, Users
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Academy {
  id: string;
  name: string;
  sport_focus: string | null;
  logo_url: string | null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [newAcademyName, setNewAcademyName] = useState("");
  const [newAcademySport, setNewAcademySport] = useState("");
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (user) loadAcademies();
  }, [user]);

  const loadAcademies = async () => {
    const { data } = await supabase.from("academies").select("*").order("created_at", { ascending: false });
    if (data) setAcademies(data);
  };

  const createAcademy = async () => {
    if (!newAcademyName.trim()) { toast.error("Enter academy name"); return; }
    setCreating(true);
    const { data, error } = await supabase.from("academies").insert({
      name: newAcademyName.trim(),
      sport_focus: newAcademySport || null,
      owner_id: user!.id,
    }).select().single();

    if (error) { toast.error(error.message); setCreating(false); return; }

    // Add owner as a member
    await supabase.from("academy_members").insert({
      academy_id: data.id,
      user_id: user!.id,
      role: "owner",
    });

    toast.success("Academy created!");
    setNewAcademyName("");
    setNewAcademySport("");
    setDialogOpen(false);
    setCreating(false);
    loadAcademies();
  };

  const features = [
    { label: "Player Roster", desc: "Manage your player database", icon: Users, path: "/players", color: "text-primary" },
    { label: "Player Reports", desc: "AI-powered progress reports", icon: ClipboardList, path: "/player-reports", color: "text-emerald-600" },
    { label: "Match Reports", desc: "Tactical match analysis", icon: Swords, path: "/match-reports", color: "text-blue-600" },
    { label: "Contracts", desc: "Player, coach & sponsorship contracts", icon: FileText, path: "/contracts", color: "text-purple-600" },
    { label: "Injury Tracker", desc: "Medical records & recovery", icon: Activity, path: "/injuries", color: "text-red-500" },
    { label: "Training", desc: "Session planning & drills", icon: Dumbbell, path: "/training", color: "text-amber-600" },
    { label: "Tournaments", desc: "Fixtures, standings, results", icon: Trophy, path: "/tournaments", color: "text-yellow-600" },
    { label: "Finances", desc: "Fees, payments, budgets", icon: DollarSign, path: "/finances", color: "text-green-600" },
    { label: "Settings", desc: "Academy profile, logo & billing", icon: Building2, path: "/settings", color: "text-gray-600" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.user_metadata?.full_name || user?.email}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1.5" /> New Academy</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Academy</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Academy Name *</label>
                <Input placeholder="e.g. Champions Cricket Academy" value={newAcademyName} onChange={(e) => setNewAcademyName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Primary Sport (optional)</label>
                <Input placeholder="e.g. Cricket" value={newAcademySport} onChange={(e) => setNewAcademySport(e.target.value)} />
              </div>
              <Button onClick={createAcademy} disabled={creating} className="w-full">
                {creating ? "Creating..." : "Create Academy"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Academies */}
      {academies.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Your Academies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {academies.map((a) => (
              <div key={a.id} className="rounded-xl border bg-card p-4 shadow-sm">
                <h3 className="font-bold text-foreground">{a.name}</h3>
                {a.sport_focus && <p className="text-sm text-muted-foreground">{a.sport_focus}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {academies.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border-2 border-dashed bg-card p-8 text-center mb-8"
        >
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold">Create Your First Academy</h3>
          <p className="text-muted-foreground text-sm mb-4">Set up your academy to start using all platform features</p>
          <Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1.5" /> Create Academy</Button>
        </motion.div>
      )}

      {/* Features Grid */}
      <h2 className="font-display text-lg font-bold mb-3">Platform Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <motion.button
            key={f.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(f.path)}
            className="rounded-xl border bg-card p-5 text-left shadow-sm hover:shadow-md transition-shadow group"
          >
            <f.icon className={`h-8 w-8 ${f.color} mb-3`} />
            <h3 className="font-bold text-foreground flex items-center gap-1">
              {f.label}
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
