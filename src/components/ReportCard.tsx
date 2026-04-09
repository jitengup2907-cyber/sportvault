import { GeneratedReport, AcademyInfo, RATING_CATEGORIES } from "@/types/player";
import { Button } from "@/components/ui/button";
import { Copy, Download, Star, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { generatePDF } from "@/lib/pdf";

interface ReportCardProps {
  report: GeneratedReport;
  academy: AcademyInfo;
}

const ReportCard = ({ report, academy }: ReportCardProps) => {
  const { player, reportText } = report;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    toast.success("Report copied to clipboard!");
  };

  const handleDownload = () => {
    generatePDF(report, academy);
  };

  const handleWhatsApp = () => {
    const text = `📋 *${academy.academyName}*\n*${academy.reportType === "annual" ? "Annual" : "Monthly"} Report Card — ${academy.periodLabel}*\n\n👤 *${player.playerName}* | ${player.sport} | ${player.position}\n📅 Attendance: ${player.sessionsAttended}/${player.totalSessions} sessions\n\n${reportText}\n\n— Coach ${academy.coachName}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-3.5 w-3.5 ${s <= rating ? "fill-primary text-primary" : "fill-muted text-border"}`} />
      ))}
    </div>
  );

  const computeAvg = (group: string) => {
    const cats = RATING_CATEGORIES.filter((c) => c.group === group);
    const rated = cats.filter((c) => player.ratings[c.key] > 0);
    if (rated.length === 0) return 0;
    return rated.reduce((sum, c) => sum + player.ratings[c.key], 0) / rated.length;
  };

  const onPitchAvg = computeAvg("on-pitch");
  const offPitchAvg = computeAvg("off-pitch");
  const overallAvg = (onPitchAvg + offPitchAvg) / 2;

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-primary/5 px-5 py-4 border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {academy.logoDataUrl && (
              <img src={academy.logoDataUrl} alt="Logo" className="h-10 w-10 rounded-lg object-contain" />
            )}
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">{player.playerName}</h3>
              <p className="text-sm text-muted-foreground">{player.sport} · {player.position} · Age {player.age}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display font-extrabold text-primary">{overallAvg.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Overall</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-3 text-xs">
          <span className="bg-card px-2.5 py-1 rounded-full border font-medium">📅 {player.sessionsAttended}/{player.totalSessions} sessions</span>
          <span className="bg-card px-2.5 py-1 rounded-full border font-medium">⚡ On-Pitch: {onPitchAvg.toFixed(1)}/5</span>
          <span className="bg-card px-2.5 py-1 rounded-full border font-medium">🏠 Off-Pitch: {offPitchAvg.toFixed(1)}/5</span>
        </div>
      </div>

      {/* Ratings breakdown */}
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b">
        {(["on-pitch", "off-pitch"] as const).map((group) => (
          <div key={group}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              {group === "on-pitch" ? "⚡ On the Pitch" : "🏠 Off the Pitch"}
            </h4>
            <div className="space-y-1.5">
              {RATING_CATEGORIES.filter((c) => c.group === group).map((cat) => (
                <div key={cat.key} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-foreground truncate">{cat.label}</span>
                  {renderStars(player.ratings[cat.key] || 0)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AI Report */}
      <div className="px-5 py-4 border-b">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">📝 Coach's Report</h4>
        <div className="bg-secondary/40 rounded-lg p-4 text-sm leading-relaxed text-foreground whitespace-pre-line">{reportText}</div>
      </div>

      {/* Actions */}
      <div className="px-5 py-3 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-1.5" /> Copy
        </Button>
        <Button size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1.5" /> PDF
        </Button>
        <Button size="sm" onClick={handleWhatsApp} className="bg-[#25D366] hover:bg-[#1da851] text-[#fff]">
          <MessageCircle className="h-4 w-4 mr-1.5" /> WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default ReportCard;
