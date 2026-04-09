export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  primaryColor: string; // hex
  secondaryColor: string; // hex
  accentColor: string; // hex
  headerBg: string; // hex
  headerText: string; // hex
  bodyText: string; // hex
}

export type ReportTone = "encouraging" | "formal" | "direct" | "motivational";

export const REPORT_TONES: { value: ReportTone; label: string; description: string }[] = [
  { value: "encouraging", label: "🌟 Encouraging", description: "Warm, positive, celebrates effort" },
  { value: "formal", label: "📋 Formal", description: "Professional, structured, objective" },
  { value: "direct", label: "⚡ Direct", description: "Clear, concise, action-oriented" },
  { value: "motivational", label: "🔥 Motivational", description: "Inspiring, energetic, aspirational" },
];

export const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: "classic-green",
    name: "Classic Green",
    description: "Professional sports academy style",
    primaryColor: "#258B58",
    secondaryColor: "#1a6b42",
    accentColor: "#34d399",
    headerBg: "#258B58",
    headerText: "#FFFFFF",
    bodyText: "#1a3320",
  },
  {
    id: "modern-blue",
    name: "Modern Blue",
    description: "Sleek and contemporary",
    primaryColor: "#2563EB",
    secondaryColor: "#1d4ed8",
    accentColor: "#60a5fa",
    headerBg: "#1e40af",
    headerText: "#FFFFFF",
    bodyText: "#1e293b",
  },
  {
    id: "bold-dark",
    name: "Bold Dark",
    description: "Premium dark theme",
    primaryColor: "#f59e0b",
    secondaryColor: "#d97706",
    accentColor: "#fbbf24",
    headerBg: "#1f2937",
    headerText: "#FFFFFF",
    bodyText: "#111827",
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    description: "Elegant and distinctive",
    primaryColor: "#7c3aed",
    secondaryColor: "#6d28d9",
    accentColor: "#a78bfa",
    headerBg: "#5b21b6",
    headerText: "#FFFFFF",
    bodyText: "#1e1b4b",
  },
  {
    id: "sport-red",
    name: "Sport Red",
    description: "Energetic and dynamic",
    primaryColor: "#dc2626",
    secondaryColor: "#b91c1c",
    accentColor: "#f87171",
    headerBg: "#991b1b",
    headerText: "#FFFFFF",
    bodyText: "#1c1917",
  },
];
