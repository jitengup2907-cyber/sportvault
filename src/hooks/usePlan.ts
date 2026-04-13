import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type PlanType = "free" | "club" | "pro";

interface PlanLimits {
  maxPlayers: number;
  maxPlayerReports: number;
  maxMatchReports: number;
  maxContracts: number;
  maxAiMessages: number;
  canUploadLogo: boolean;
  canUploadVideo: boolean;
  canShareReports: boolean;
  hasWatermark: boolean;
}

const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxPlayers: 20, maxPlayerReports: 10, maxMatchReports: 3,
    maxContracts: 0, maxAiMessages: 10,
    canUploadLogo: false, canUploadVideo: false, canShareReports: false, hasWatermark: true,
  },
  club: {
    maxPlayers: 75, maxPlayerReports: Infinity, maxMatchReports: Infinity,
    maxContracts: 5, maxAiMessages: 100,
    canUploadLogo: true, canUploadVideo: false, canShareReports: false, hasWatermark: false,
  },
  pro: {
    maxPlayers: Infinity, maxPlayerReports: Infinity, maxMatchReports: Infinity,
    maxContracts: Infinity, maxAiMessages: Infinity,
    canUploadLogo: true, canUploadVideo: true, canShareReports: true, hasWatermark: false,
  },
};

interface UsageData {
  player_reports_count: number;
  match_reports_count: number;
  contracts_count: number;
  ai_messages_count: number;
}

function getCurrentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function usePlan() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<PlanType>("free");
  const [usage, setUsage] = useState<UsageData>({
    player_reports_count: 0, match_reports_count: 0,
    contracts_count: 0, ai_messages_count: 0,
  });
  const [loading, setLoading] = useState(true);

  const limits = PLAN_LIMITS[plan];
  const month = getCurrentMonth();

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      // Get plan from profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("user_id", user.id)
        .single();
      if (profile?.plan) setPlan(profile.plan as PlanType);

      // Get usage
      const { data: usageData } = await supabase
        .from("user_usage")
        .select("*")
        .eq("user_id", user.id)
        .eq("month", month)
        .single();
      if (usageData) {
        setUsage({
          player_reports_count: usageData.player_reports_count,
          match_reports_count: usageData.match_reports_count,
          contracts_count: usageData.contracts_count,
          ai_messages_count: usageData.ai_messages_count,
        });
      }
      setLoading(false);
    };
    load();
  }, [user, month]);

  const incrementUsage = useCallback(async (field: keyof UsageData) => {
    if (!user) return;
    // Upsert usage row
    const { data: existing } = await supabase
      .from("user_usage")
      .select("id, " + field)
      .eq("user_id", user.id)
      .eq("month", month)
      .single();

    if (existing) {
      const currentVal = (existing as any)[field] || 0;
      const updatePayload: Record<string, number> = {};
      updatePayload[field] = currentVal + 1;
      await supabase
        .from("user_usage")
        .update(updatePayload as any)
        .eq("id", (existing as any).id);
    } else {
      const insertPayload: any = {
        user_id: user.id,
        month,
      };
      insertPayload[field] = 1;
      await supabase.from("user_usage").insert(insertPayload);
    }

    setUsage((prev) => ({ ...prev, [field]: prev[field] + 1 }));
  }, [user, month]);

  const canUseFeature = useCallback((feature: keyof UsageData): boolean => {
    const limitMap: Record<keyof UsageData, number> = {
      player_reports_count: limits.maxPlayerReports,
      match_reports_count: limits.maxMatchReports,
      contracts_count: limits.maxContracts,
      ai_messages_count: limits.maxAiMessages,
    };
    return usage[feature] < limitMap[feature];
  }, [usage, limits]);

  return { plan, setPlan, limits, usage, loading, incrementUsage, canUseFeature };
}
