import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { usePlan } from "@/hooks/usePlan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, Lock, Copy, Building2 } from "lucide-react";
import BackButton from "@/components/BackButton";

const Settings = () => {
  const { user } = useAuth();
  const { plan } = usePlan();
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [sportFocus, setSportFocus] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) loadAcademy();
  }, [user]);

  const loadAcademy = async () => {
    const { data } = await supabase.from("academies").select("*").limit(1).single();
    if (data) {
      setAcademyId(data.id);
      setName(data.name);
      setSportFocus(data.sport_focus || "");
      setLogoUrl(data.logo_url);
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!academyId || !user) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Logo must be under 2MB"); return; }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${academyId}/logo.${ext}`;

    const { error } = await supabase.storage.from("academy-logos").upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed: " + error.message); setUploading(false); return; }

    const { data: urlData } = supabase.storage.from("academy-logos").getPublicUrl(path);
    const url = urlData.publicUrl;
    
    await supabase.from("academies").update({ logo_url: url }).eq("id", academyId);
    setLogoUrl(url);
    toast.success("Logo uploaded!");
    setUploading(false);
  };

  const handleSave = async () => {
    if (!academyId) return;
    setSaving(true);
    const { error } = await supabase.from("academies").update({
      name, sport_focus: sportFocus || null,
    }).eq("id", academyId);
    if (error) toast.error(error.message);
    else toast.success("Settings saved!");
    setSaving(false);
  };

  const referralLink = user ? `sportvault.in/ref/${user.id.slice(0, 8)}` : "";

  const planBadge = plan === "pro" ? "bg-blue-500" : plan === "club" ? "bg-primary" : "bg-muted-foreground";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-20">
      <BackButton />
      <h1 className="font-display text-3xl font-extrabold text-foreground mb-6">Academy Settings</h1>

      {/* Academy Profile */}
      <div className="rounded-xl border bg-card p-6 shadow-sm mb-6 space-y-4">
        <h2 className="font-display text-lg font-bold flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" /> Academy Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Academy Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Sport(s) Focus</label>
            <Input value={sportFocus} onChange={(e) => setSportFocus(e.target.value)} placeholder="e.g. Cricket, Football" />
          </div>
        </div>

        {/* Logo */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Academy Logo</label>
          {plan === "free" ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              <Lock className="h-4 w-4" /> Upgrade to Club to add your academy logo to all reports
            </div>
          ) : (
            <>
              {logoUrl && (
                <div className="flex items-center gap-3 mb-2">
                  <img src={logoUrl} alt="Academy logo" className="h-16 w-16 object-contain rounded-lg border" />
                </div>
              )}
              <label className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{uploading ? "Uploading..." : "Upload logo (PNG, JPG, SVG, max 2MB)"}</span>
                <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); }} />
              </label>
            </>
          )}
        </div>

        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
      </div>

      {/* Current Plan */}
      <div className="rounded-xl border bg-card p-6 shadow-sm mb-6">
        <h2 className="font-display text-lg font-bold mb-3">Current Plan</h2>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${planBadge}`}>
            {plan.toUpperCase()}
          </span>
          {plan === "free" && (
            <Button size="sm" variant="outline" onClick={() => window.location.href = "/pricing"}>
              Upgrade Plan
            </Button>
          )}
          {plan !== "free" && (
            <a href="mailto:support@sportvault.in" className="text-sm text-primary hover:underline">Manage Billing</a>
          )}
        </div>
      </div>

      {/* Referral */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold mb-2">Referral Program</h2>
        <p className="text-sm text-muted-foreground mb-3">Share this link. For every new paid academy that signs up through you, get 1 month free.</p>
        <div className="flex items-center gap-2">
          <Input value={referralLink} readOnly className="text-sm" />
          <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(referralLink); toast.success("Link copied!"); }}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
