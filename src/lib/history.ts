import { SavedReport } from "@/types/player";

const STORAGE_KEY = "sportvault_history";

export function getSavedReports(): SavedReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReport(report: SavedReport) {
  const existing = getSavedReports();
  // Deduplicate by playerName + periodLabel
  const filtered = existing.filter(
    (r) => !(r.playerName === report.playerName && r.periodLabel === report.periodLabel)
  );
  filtered.push(report);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getPlayerHistory(playerName: string): SavedReport[] {
  return getSavedReports().filter((r) => r.playerName.toLowerCase() === playerName.toLowerCase());
}

export function getAllPlayerNames(): string[] {
  const reports = getSavedReports();
  return [...new Set(reports.map((r) => r.playerName))];
}
