export interface PlayerData {
  id: string;
  playerName: string;
  age: number;
  sport: string;
  position: string;
  sessionsAttended: number;
  totalSessions: number;
  skillRating: number;
  fitnessRating: number;
  teamworkRating: number;
  strengthNote: string;
  improvementNote: string;
  standoutMoment: string;
}

export interface AcademyInfo {
  academyName: string;
  coachName: string;
}

export interface GeneratedReport {
  player: PlayerData;
  reportText: string;
}
