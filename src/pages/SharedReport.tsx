import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ClipboardList, Shield } from "lucide-react";

const SharedReport = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { setError("Invalid share link"); setLoading(false); return; }
    loadReport();
  }, [token]);

  const loadReport = async () => {
    const { data: shared, error: sharedErr } = await supabase
      .from("shared_reports")
      .select("*, reports(*)")
      .eq("share_token", token!)
      .maybeSingle();

    if (sharedErr || !shared) {
      setError("Report not found or link has expired");
      setLoading(false);
      return;
    }

    setReport(shared);
    setLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading report...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <h2 className="font-display text-xl font-bold">{error}</h2>
        <p className="text-muted-foreground text-sm mt-2">Please check with your coach for the correct link.</p>
      </div>
    </div>
  );

  const r = report.reports;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <ClipboardList className="h-4 w-4" /> Player Report
          </div>
          <h1 className="font-display text-2xl font-extrabold text-foreground">
            {r?.player_name}'s {r?.report_type === "annual" ? "Annual" : "Monthly"} Report
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{r?.period_label} · {r?.sport}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border bg-card p-6 shadow-sm"
        >
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
            {r?.report_text}
          </div>

          {r?.ratings && Object.keys(r.ratings).length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="font-bold text-sm mb-2">Performance Ratings</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(r.ratings as Record<string, number>).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="font-bold">{val}/5</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Powered by SportVault · Every Sport. Every Record. One Vault.
        </p>
      </div>
    </div>
  );
};

export default SharedReport;
