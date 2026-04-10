import { useState } from "react";
import { DollarSign, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface FinanceEntry {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: string;
}

const CATEGORIES = {
  income: ["Player Fee", "Sponsorship", "Tournament Prize", "Membership", "Other Income"],
  expense: ["Equipment", "Facility Rent", "Coach Salary", "Travel", "Insurance", "Medical", "Other Expense"],
};

const Finances = () => {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<FinanceEntry>>({
    type: "income",
    date: new Date().toISOString().split("T")[0],
  });

  const addEntry = () => {
    if (!form.amount || !form.category) { toast.error("Fill amount and category"); return; }
    setEntries(prev => [{
      id: crypto.randomUUID(),
      type: form.type as "income" | "expense",
      category: form.category || "",
      amount: form.amount || 0,
      description: form.description || "",
      date: form.date || "",
    }, ...prev]);
    setForm({ type: "income", date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
    toast.success("Entry added");
  };

  const totalIncome = entries.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const totalExpense = entries.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Finances</h1>
          <p className="text-muted-foreground">Track fees, payments, and budgets.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1.5" /> Add Entry</Button>
      </div>

      {/* Summary Cards */}
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
              <Select value={form.type} onValueChange={(v) => setForm(f => ({ ...f, type: v as any, category: "" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Category *</label>
              <Select value={form.category || ""} onValueChange={(v) => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES[form.type as keyof typeof CATEGORIES]?.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Amount *</label>
              <Input type="number" placeholder="0.00" value={form.amount || ""} onChange={(e) => setForm(f => ({ ...f, amount: parseFloat(e.target.value) || 0 }))} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Date</label>
              <Input type="date" value={form.date || ""} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div className="space-y-1.5 md:col-span-2"><label className="text-sm font-medium">Description</label>
              <Input placeholder="Details..." value={form.description || ""} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} /></div>
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
                {e.type === "income" ? "+" : "-"}${e.amount.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">{e.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Finances;
