import { PlayerData, AcademyInfo } from "@/types/player";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getCurrentMonthYear() {
  const d = new Date();
  return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

const SYSTEM_PROMPT = `You are a professional youth sports coach writing a monthly progress report for a player's parents. Your tone is warm, encouraging, specific, and professional — like a thoughtful teacher writing a school report. Never use generic phrases. Reference the actual data given. Frame improvement areas as exciting growth opportunities, not failures. Keep the report between 160-200 words. Structure it as 3 short paragraphs: (1) overall summary and attendance, (2) skills and strengths, (3) improvement focus and encouragement for next month. End with one motivational sentence addressed directly to the player by name.`;

function buildUserMessage(player: PlayerData, academy: AcademyInfo): string {
  return `Generate a player report card using this data:
Player: ${player.playerName}, Age: ${player.age}, Sport: ${player.sport}, Position: ${player.position}
Attendance: ${player.sessionsAttended}/${player.totalSessions} sessions
Skill Ratings (out of 5): Ball Control: ${player.skillRating}, Fitness: ${player.fitnessRating}, Teamwork: ${player.teamworkRating}
Coach strength note: ${player.strengthNote}
Coach improvement note: ${player.improvementNote}
Standout moment: ${player.standoutMoment || "none noted"}
Academy: ${academy.academyName}, Coach: ${academy.coachName}, Month: ${getCurrentMonthYear()}`;
}

export async function generateReport(
  player: PlayerData,
  academy: AcademyInfo,
  supabaseUrl: string,
  supabaseKey: string
): Promise<string> {
  const response = await fetch(`${supabaseUrl}/functions/v1/generate-report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({
      systemPrompt: SYSTEM_PROMPT,
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
