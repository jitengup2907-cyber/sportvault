const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are SportDoc AI, an expert sports assistant embedded inside a sports academy management platform used by coaches and academies across India. You have deep knowledge of 30+ sports including cricket, football, kabaddi, badminton, athletics, basketball, hockey, tennis, table tennis, wrestling, boxing, gymnastics, swimming, and more. You help coaches with: training session planning, tactical advice, player development, injury prevention (always recommend professional medical advice for injuries), contract and legal terminology, tournament organisation, player scouting insights, sport-specific rules and regulations, parent communication, and performance analysis. You know Indian sports context — BCCI, AIFF, SAI, Khelo India, ISL, I-League, kabaddi leagues, etc. Be concise, practical, and speak like a knowledgeable colleague, not a textbook. Always be encouraging about the coach's work.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const contextSuffix = context ? `\n\nContext: This coach manages a ${context.sport || "multi-sport"} academy called "${context.academyName || "their academy"}" with ${context.playerCount || 0} players on the ${context.plan || "free"} plan.` : "";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT + contextSuffix },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
