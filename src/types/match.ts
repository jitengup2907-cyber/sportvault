export interface MatchData {
  id: string;
  teamName: string;
  opponentName: string;
  sport: string;
  matchDate: string;
  venue: string;
  result: "win" | "loss" | "draw";
  scoreOwn: string;
  scoreOpponent: string;
  formation: string;
  possession: string;
  keyPlayers: string;
  goalsScored: string;
  goalsConceded: string;
  tacticalNotes: string;
  strengthAreas: string;
  weaknessAreas: string;
  substitutions: string;
  injuries: string;
  coachRemarks: string;
}

export function createEmptyMatch(): MatchData {
  return {
    id: crypto.randomUUID(),
    teamName: "",
    opponentName: "",
    sport: "",
    matchDate: new Date().toISOString().split("T")[0],
    venue: "",
    result: "win",
    scoreOwn: "",
    scoreOpponent: "",
    formation: "",
    possession: "",
    keyPlayers: "",
    goalsScored: "",
    goalsConceded: "",
    tacticalNotes: "",
    strengthAreas: "",
    weaknessAreas: "",
    substitutions: "",
    injuries: "",
    coachRemarks: "",
  };
}

export interface GeneratedMatchReport {
  match: MatchData;
  reportText: string;
  generatedAt: string;
}
