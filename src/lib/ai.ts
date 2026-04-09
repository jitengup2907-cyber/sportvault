import { PlayerData, AcademyInfo, RATING_CATEGORIES } from "@/types/player";

const SYSTEM_PROMPT_MONTHLY = `You are a professional youth sports coach writing a monthly progress report for a player's parents. Your tone is warm, encouraging, specific, and professional — like a thoughtful teacher writing a school report. Never use generic phrases. Reference the actual data given. Frame improvement areas as exciting growth opportunities, not failures. Keep the report between 200-280 words. Structure it as 4 short paragraphs: (1) overall summary, attendance, and highlight, (2) on-pitch assessment covering physical skill, mental game, and social dynamics, (3) off-pitch habits and character, (4) improvement focus, goals for next month, and encouragement. End with one motivational sentence addressed directly to the player by name.`;

const SYSTEM_PROMPT_ANNUAL = `You are a professional youth sports coach writing a comprehensive annual progress report for a player's parents. Your tone is warm, reflective, encouraging, and professional. Never use generic phrases. Reference the actual data given. Frame improvement areas as exciting growth opportunities, not failures. Keep the report between 350-450 words. Structure it as 5 paragraphs: (1) year-in-review summary with attendance and overall growth trajectory, (2) on-pitch development — physical skills, mental resilience, and tactical understanding, (3) on-pitch social dynamics — teamwork, leadership, sportsmanship, (4) off-pitch character — discipline, attitude, fitness habits, peer relationships, (5) looking ahead — goals, areas of focus, and a heartfelt closing message addressed to the player by name.`;

function buildRatingsText(player: PlayerData): string {
  const groups = ["on-pitch", "off-pitch"] as const;
  const dimensions = ["physical", "mental", "social"] as const;
  const lines: string[] = [];

  for (const group of groups) {
    lines.push(`\n${group === "on-pitch" ? "ON THE PITCH" : "OFF THE PITCH"}:`);
    for (const dim of dimensions) {
      const cats = RATING_CATEGORIES.filter((c) => c.group === group && c.dimension === dim);
      const parts = cats.map((c) => `${c.label}: ${player.ratings[c.key] || 0}/5`);
      lines.push(`  ${dim.charAt(0).toUpperCase() + dim.slice(1)}: ${parts.join(", ")}`);
    }
  }
  return lines.join("\n");
}

function buildUserMessage(player: PlayerData, academy: AcademyInfo): string {
  return `Generate a ${academy.reportType} player report card using this data:
Player: ${player.playerName}, Age: ${player.age}, Sport: ${player.sport}, Position: ${player.position}
Attendance: ${player.sessionsAttended}/${player.totalSessions} sessions
Period: ${academy.periodLabel}

RATINGS (all out of 5):${buildRatingsText(player)}

Coach's key strength note: ${player.strengthNote}
Coach's improvement note: ${player.improvementNote}
Standout moment: ${player.standoutMoment || "none noted"}
Goals for next period: ${player.goals || "not specified"}
Academy: ${academy.academyName}, Coach: ${academy.coachName}`;
}

export async function generateReport(
  player: PlayerData,
  academy: AcademyInfo,
  supabaseUrl: string,
  supabaseKey: string
): Promise<string> {
  const systemPrompt = academy.reportType === "annual" ? SYSTEM_PROMPT_ANNUAL : SYSTEM_PROMPT_MONTHLY;

  const response = await fetch(`${supabaseUrl}/functions/v1/generate-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({
      systemPrompt,
      userMessage: buildUserMessage(player, academy),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to generate report: ${err}`);
  }

  const data = await response.json();
  return data.reportText;
}
