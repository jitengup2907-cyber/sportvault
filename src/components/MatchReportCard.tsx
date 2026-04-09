import { GeneratedMatchReport } from "@/types/match";
import { Button } from "@/components/ui/button";
import { Copy, Download, MessageCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import { ReportTemplate } from "@/types/template";

interface MatchReportCardProps {
  report: GeneratedMatchReport;
  coachName: string;
  template: ReportTemplate;
  onDownloadPDF: () => void;
  onDownloadDocx: () => void;
}

const MatchReportCard = ({ report, coachName, template, onDownloadPDF, onDownloadDocx }: MatchReportCardProps) => {
  const { match, reportText } = report;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    toast.success("Report copied to clipboard!");
  };

  const handleWhatsApp = () => {
    const text = `⚽ *Match Report*\n*${match.teamName} vs ${match.opponentName}*\n📅 ${match.matchDate} | ${match.venue}\n🏆 Result: ${match.result.toUpperCase()} (${match.scoreOwn} - ${match.scoreOpponent})\n\n${reportText}\n\n— Coach ${coachName}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const resultColor = match.result === "win" ? "text-green-600" : match.result === "loss" ? "text-red-500" : "text-yellow-600";
  const resultEmoji = match.result === "win" ? "🏆" : match.result === "loss" ? "💪" : "🤝";

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b" style={{ backgroundColor: template.primaryColor + "10" }}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">
              {match.teamName} vs {match.opponentName}
            </h3>
            <p className="text-sm text-muted-foreground">{match.sport} · {match.matchDate} · {match.venue}</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-display font-extrabold ${resultColor}`}>
              {resultEmoji} {match.result.toUpperCase()}
            </div>
            <div className="text-sm font-bold">{match.scoreOwn} - {match.scoreOpponent}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          {match.formation && <span className="bg-card px-2.5 py-1 rounded-full border font-medium">📐 {match.formation}</span>}
          {match.possession && <span className="bg-card px-2.5 py-1 rounded-full border font-medium">⚽ {match.possession}% possession</span>}
        </div>
      </div>

      <div className="px-5 py-4 border-b">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">📝 Tactical Report</h4>
        <div className="bg-secondary/40 rounded-lg p-4 text-sm leading-relaxed text-foreground whitespace-pre-line">{reportText}</div>
      </div>

      <div className="px-5 py-3 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-1.5" /> Copy
        </Button>
        <Button size="sm" onClick={onDownloadPDF}>
          <Download className="h-4 w-4 mr-1.5" /> PDF
        </Button>
        <Button size="sm" variant="outline" onClick={onDownloadDocx}>
          <FileText className="h-4 w-4 mr-1.5" /> Word
        </Button>
        <Button size="sm" onClick={handleWhatsApp} className="bg-[#25D366] hover:bg-[#1da851] text-white">
          <MessageCircle className="h-4 w-4 mr-1.5" /> WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default MatchReportCard;
