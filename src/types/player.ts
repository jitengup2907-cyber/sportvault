export type ReportType = "monthly" | "annual";

export interface RatingCategory {
  key: string;
  label: string;
  group: "on-pitch" | "off-pitch";
  dimension: "physical" | "mental" | "social";
}

export const RATING_CATEGORIES: RatingCategory[] = [
  // On-Pitch — Physical
  { key: "endurance", label: "Endurance & Stamina", group: "on-pitch", dimension: "physical" },
  { key: "speed", label: "Speed & Agility", group: "on-pitch", dimension: "physical" },
  { key: "technique", label: "Technique & Skill", group: "on-pitch", dimension: "physical" },
  { key: "strength", label: "Strength & Power", group: "on-pitch", dimension: "physical" },
  // On-Pitch — Mental
  { key: "focus", label: "Focus & Concentration", group: "on-pitch", dimension: "mental" },
  { key: "gameIQ", label: "Game Awareness / IQ", group: "on-pitch", dimension: "mental" },
  { key: "composure", label: "Composure Under Pressure", group: "on-pitch", dimension: "mental" },
  // On-Pitch — Social
  { key: "teamwork", label: "Teamwork & Communication", group: "on-pitch", dimension: "social" },
  { key: "sportsmanship", label: "Sportsmanship", group: "on-pitch", dimension: "social" },
  { key: "leadership", label: "Leadership on Field", group: "on-pitch", dimension: "social" },
  // Off-Pitch — Physical
  { key: "fitness", label: "Overall Fitness Level", group: "off-pitch", dimension: "physical" },
  { key: "nutrition", label: "Nutrition & Hydration", group: "off-pitch", dimension: "physical" },
  { key: "restRecovery", label: "Rest & Recovery", group: "off-pitch", dimension: "physical" },
  // Off-Pitch — Mental
  { key: "discipline", label: "Discipline & Punctuality", group: "off-pitch", dimension: "mental" },
  { key: "attitude", label: "Attitude & Coachability", group: "off-pitch", dimension: "mental" },
  { key: "goalSetting", label: "Goal Setting & Self-Motivation", group: "off-pitch", dimension: "mental" },
  // Off-Pitch — Social
  { key: "respect", label: "Respect for Peers & Coaches", group: "off-pitch", dimension: "social" },
  { key: "offFieldTeamwork", label: "Team Bonding & Support", group: "off-pitch", dimension: "social" },
];

export const SPORTS = [
  "Cricket",
  "Football",
  "Badminton",
  "Table Tennis",
  "Basketball",
  "Volleyball",
  "Other",
] as const;

export type Sport = (typeof SPORTS)[number];

export interface PlayerData {
  id: string;
  playerName: string;
  age: number;
  sport: string;
  position: string;
  sessionsAttended: number;
  totalSessions: number;
  ratings: Record<string, number>; // key from RATING_CATEGORIES -> 1-5
  strengthNote: string;
  improvementNote: string;
  standoutMoment: string;
  goals: string; // goals for next period
}

export interface AcademyInfo {
  academyName: string;
  coachName: string;
  reportType: ReportType;
  periodLabel: string; // e.g. "April 2026" or "2025-2026"
}

export interface GeneratedReport {
  player: PlayerData;
  reportText: string;
}
