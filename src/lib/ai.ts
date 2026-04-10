import { PlayerData, AcademyInfo, RATING_CATEGORIES } from "@/types/player";
import { MatchData } from "@/types/match";
import { ReportTone } from "@/types/template";
import { getSportAIContext, getSportConfig } from "@/types/sports";

const TONE_INSTRUCTIONS: Record<ReportTone, string> = {
  encouraging: "Your tone is warm, encouraging, positive, and celebratory. Frame everything as growth. Use uplifting language. Celebrate effort and small wins.",
  formal: "Your tone is formal, professional, and objective. Use structured language. Be precise with observations. Maintain a professional distance while being constructive.",
  direct: "Your tone is direct, clear, and action-oriented. Cut to the chase. Use short sentences. Be specific about what needs improvement and what was done well. No fluff.",
  motivational: "Your tone is inspiring, energetic, and aspirational. Use powerful language. Paint a vision of what the player can become. Be passionate and driven.",
};

function getPlayerSystemPrompt(reportType: "monthly" | "annual", tone: ReportTone): string {
  const toneInstruction = TONE_INSTRUCTIONS[tone];

  if (reportType === "monthly") {
    return `You are a professional youth sports coach writing a monthly progress report for a player's parents. ${toneInstruction}

CRITICAL RULES:
- Never use generic or filler phrases. Every sentence must reference specific data provided.
- Reference actual rating scores (e.g., "scored 4/5 in composure").
- Calculate and mention the attendance percentage.
- Mention specific dimensions where the player excels or needs work.
- Reference the coach's notes and standout moment directly.
- Keep the report between 250-350 words.

Structure as 5 paragraphs:
(1) Opening summary with attendance stats and overall trajectory
(2) On-pitch assessment: physical skills with specific ratings, game intelligence, tactical awareness
(3) On-pitch social: teamwork dynamics, leadership moments, sportsmanship examples
(4) Off-pitch character: discipline, attitude, fitness habits, goal-setting behavior
(5) Improvement focus with specific, actionable steps + encouragement. End with one motivational sentence addressed directly to the player by name.`;
  }

  return `You are a professional youth sports coach writing a comprehensive annual progress report for a player's parents. ${toneInstruction}

CRITICAL RULES:
- Never use generic or filler phrases. Every sentence must reference specific data provided.
- Reference actual rating scores throughout the report.
- Calculate and mention the attendance percentage.
- Discuss growth trajectory and character development over the year.
- Reference specific strengths, improvement areas, standout moments, and goals.
- Keep the report between 400-550 words.

Structure as 6 paragraphs:
(1) Year-in-review summary with attendance, overall growth trajectory, and defining theme of the year
(2) On-pitch physical development: specific skills, technique improvement, endurance and strength
(3) On-pitch mental game: focus, game awareness, composure under pressure, tactical understanding
(4) On-pitch social dynamics: teamwork, leadership evolution, sportsmanship
(5) Off-pitch character: discipline, attitude, fitness habits, peer relationships, goal-setting maturity
(6) Looking ahead: specific goals, areas of focus, development plan, and a heartfelt closing message addressed to the player by name`;
}

function getMatchSystemPrompt(tone: ReportTone): string {
  const toneInstruction = TONE_INSTRUCTIONS[tone];

  return `You are a professional sports analyst writing a tactical match summary report for a coaching staff. ${toneInstruction}

CRITICAL RULES:
- Reference ALL data provided: scores, formations, key players, tactical notes, strengths, weaknesses.
- Analyze tactical decisions and their outcomes.
- Evaluate team performance holistically — attack, defense, transitions, set pieces.
- Highlight individual contributions and their impact on the result.
- Suggest specific tactical adjustments for future matches.
- Keep the report between 350-500 words.

Structure as 6 paragraphs:
(1) Match overview: result, scoreline, venue, and overall narrative of the match
(2) Tactical analysis: formation effectiveness, attacking patterns, defensive structure
(3) Key player performances: individual contributions and impact moments
(4) Team strengths demonstrated: what worked well and why
(5) Areas requiring improvement: specific tactical/technical weaknesses with solutions
(6) Looking forward: recommended tactical adjustments, training focus areas, and preparation notes for upcoming fixtures`;
}

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

function buildPlayerMessage(player: PlayerData, academy: AcademyInfo): string {
  const attendancePct = player.totalSessions > 0
    ? ((player.sessionsAttended / player.totalSessions) * 100).toFixed(0)
    : "N/A";

  return `Generate a ${academy.reportType} player report card using this data:
Player: ${player.playerName}, Age: ${player.age}, Sport: ${player.sport}, Position: ${player.position}
Attendance: ${player.sessionsAttended}/${player.totalSessions} sessions (${attendancePct}%)
Period: ${academy.periodLabel}

RATINGS (all out of 5):${buildRatingsText(player)}

Coach's key strength note: ${player.strengthNote}
Coach's improvement note: ${player.improvementNote}
Standout moment: ${player.standoutMoment || "none noted"}
Goals for next period: ${player.goals || "not specified"}
Academy: ${academy.academyName}, Coach: ${academy.coachName}`;
}

function buildMatchMessage(match: MatchData, coachName: string): string {
  return `Generate a tactical match summary report using this data:
Team: ${match.teamName} vs ${match.opponentName}
Sport: ${match.sport}
Date: ${match.matchDate}, Venue: ${match.venue}
Result: ${match.result.toUpperCase()} (${match.scoreOwn} - ${match.scoreOpponent})
Formation/Setup: ${match.formation || "not specified"}
Possession: ${match.possession || "not recorded"}%

Key Players & Performances: ${match.keyPlayers}
Tactical Notes: ${match.tacticalNotes}
Team Strengths: ${match.strengthAreas || "not noted"}
Areas to Improve: ${match.weaknessAreas || "not noted"}
Substitutions: ${match.substitutions || "none"}
Injuries: ${match.injuries || "none"}
Coach's Remarks: ${match.coachRemarks || "none"}
Coach: ${coachName}`;
}

async function callEdgeFunction(
  systemPrompt: string,
  userMessage: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<string> {
  const response = await fetch(`${supabaseUrl}/functions/v1/generate-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({ systemPrompt, userMessage }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to generate report: ${err}`);
  }

  const data = await response.json();
  return data.reportText;
}

export async function generateReport(
  player: PlayerData,
  academy: AcademyInfo,
  supabaseUrl: string,
  supabaseKey: string,
  tone: ReportTone = "encouraging"
): Promise<string> {
  const systemPrompt = getPlayerSystemPrompt(academy.reportType, tone);
  return callEdgeFunction(systemPrompt, buildPlayerMessage(player, academy), supabaseUrl, supabaseKey);
}

export async function generateMatchReport(
  match: MatchData,
  coachName: string,
  supabaseUrl: string,
  supabaseKey: string,
  tone: ReportTone = "direct"
): Promise<string> {
  const systemPrompt = getMatchSystemPrompt(tone);
  return callEdgeFunction(systemPrompt, buildMatchMessage(match, coachName), supabaseUrl, supabaseKey);
}
