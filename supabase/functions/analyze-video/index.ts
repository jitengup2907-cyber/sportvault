const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are SportVault AI Video Analyst. You analyze match footage descriptions and generate comprehensive tactical analysis reports for coaches and sports academies. Your analysis should cover:

1. **Key Moments**: Identify goals, assists, defensive errors, tactical shifts, substitution impacts
2. **Tactical Patterns**: Formation effectiveness, pressing intensity, transition play, set pieces
3. **Player Performances**: Individual standout moments, areas for improvement
4. **Team Analysis**: Possession patterns, passing accuracy trends, defensive shape, attacking threats
5. **Recommendations**: Tactical adjustments, training focus areas, player development priorities

Be sport-specific — use correct terminology for the sport being analyzed. For cricket use overs/wickets/run-rate terminology, for football use formations/pressing/counter-attack, for basketball use plays/screens/transitions, etc.

Format the report with clear sections using markdown-style headers. Be data-driven and specific.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { sport, teamName, opponentName, matchDate, clipDescriptions, manualNotes, formation, result } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `Analyze the following match for a ${sport} team:

Team: ${teamName} vs ${opponentName}
Date: ${matchDate}
Formation: ${formation || "Not specified"}
Result: ${result || "Not specified"}

Video Clip Descriptions & Key Moments:
${clipDescriptions?.map((c: any, i: number) => `Clip ${i + 1} (${c.timestamp || "N/A"}): ${c.description}`).join("\n") || "No clips provided"}

Coach's Manual Notes:
${manualNotes || "No additional notes"}

Generate a comprehensive tactical analysis report covering key moments, tactical patterns, player performances, team analysis, and recommendations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
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
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("video analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
