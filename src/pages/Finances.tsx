import { useState, useEffect } from "react";
import { DollarSign, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BackButton from "@/components/BackButton";

const CATEGORIES = {
  income: ["Player Fee", "Sponsorship", "Tournament Prize", "Membership", "Other Income"],
  expense: ["Equipment", "Facility Rent", "Coach Salary", "Travel", "Insurance", "Medical", "Other Expense"],
};

const Finances = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({
    type: "income", date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => { if (user) loadAcademy(); }, [user]);

  const loadAcademy = async () => {
    const { data } = await supabase.from("academies").select("id").limit(1).single();
    if (data) { setAcademyId(data.id); loadEntries(data.id); }
  };

  const loadEntries = async (aId: string) => {
    const { data } = await supabase.from("finances").select("*").eq("academy_id", aId).order("transaction_date", { ascending: false });
    if (data) setEntries(data);
  };

  const addEntry = async () => {
    if (!form.amount || !form.category) { toast.error("Fill amount and category"); return; }
    if (!academyId || !user) { toast.error("Create an academy first"); return; }
    const { error } = await supabase.from("finances").insert({
      academy_id: academyId, created_by: user.id,
      type: form.type, category: form.category,
      amount: parseFloat(form.amount), description: form.description || null,
      transaction_date: form.date,
    });
    if (error) { toast.error(error.message); return; }
    setForm({ type: "income", date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
    toast.success("Entry added");
    loadEntries(academyId);
  };

  const totalIncome = entries.filter(e => e.type === "income").reduce((s, e) => s + Number(e.amount), 0);
  const totalExpense = entries.filter(e => e.type === "expense").reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <BackButton />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Finances</h1>
          <p className="text-muted-foreground">Track fees, payments, and budgets.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1.5" /> Add Entry</Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Income</p>
          <p className="text-xl font-bold text-emerald-600 flex items-center gap-1"><TrendingUp className="h-4 w-4" /> ${totalIncome.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Expenses</p>
          <p className="text-xl font-bold text-red-500 flex items-center gap-1"><TrendingDown className="h-4 w-4" /> ${totalExpense.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Balance</p>
          <p className={`text-xl font-bold ${totalIncome - totalExpense >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            ${(totalIncome - totalExpense).toLocaleString()}
          </p>
        </div>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border bg-card p-5 shadow-sm mb-6 space-y-4">
          <h2 className="font-display text-lg font-bold">New Entry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><label className="text-sm font-medium">Type</label>
              <Select value={form.type} onValueChange={(v) => setForm((f: any) => ({ ...f, type: v, category: "" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Category *</label>
              <Select value={form.category || ""} onValueChange={(v) => setForm((f: any) => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES[form.type as keyof typeof CATEGORIES]?.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Amount *</label>
              <Input type="number" placeholder="0.00" value={form.amount || ""} onChange={(e) => setForm((f: any) => ({ ...f, amount: e.target.value }))} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Date</label>
              <Input type="date" value={form.date || ""} onChange={(e) => setForm((f: any) => ({ ...f, date: e.target.value }))} /></div>
            <div className="space-y-1.5 md:col-span-2"><label className="text-sm font-medium">Description</label>
              <Input placeholder="Details..." value={form.description || ""} onChange={(e) => setForm((f: any) => ({ ...f, description: e.target.value }))} /></div>
          </div>
          <Button onClick={addEntry} className="w-full">Add Entry</Button>
        </motion.div>
      )}

      {entries.length === 0 && !showForm && (
        <div className="rounded-xl border-2 border-dashed bg-card p-12 text-center">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold">No Financial Records</h3>
          <p className="text-muted-foreground text-sm">Start tracking income and expenses.</p>
        </div>
      )}

      <div className="space-y-2">
        {entries.map((e) => (
          <div key={e.id} className="rounded-lg border bg-card p-3 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              {e.type === "income" ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
              <div>
                <p className="text-sm font-medium">{e.category}</p>
                {e.description && <p className="text-xs text-muted-foreground">{e.description}</p>}
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${e.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                {e.type === "income" ? "+" : "-"}${Number(e.amount).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">{e.transaction_date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Finances;
