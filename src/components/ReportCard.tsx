import { GeneratedReport, AcademyInfo } from "@/types/player";
import { Button } from "@/components/ui/button";
import { Copy, Download, Star } from "lucide-react";
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

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-4 w-4 ${s <= rating ? "fill-primary text-primary" : "fill-muted text-border"}`}
        />
      ))}
    </div>
  );

  return (
    <div className="rounded-xl border bg-card p-5 md:p-6 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">{player.playerName}</h3>
          <p className="text-sm text-muted-foreground">
            {player.sport} · {player.position} · Age {player.age}
          </p>
        </div>
        <span className="text-sm font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
          {player.sessionsAttended}/{player.totalSessions} sessions
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Skill:</span>
          {renderStars(player.skillRating)}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Fitness:</span>
          {renderStars(player.fitnessRating)}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Teamwork:</span>
          {renderStars(player.teamworkRating)}
        </div>
      </div>

      <div className="bg-secondary/50 rounded-lg p-4 text-sm leading-relaxed text-foreground whitespace-pre-line">
        {reportText}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-1.5" /> Copy Text
        </Button>
        <Button size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-1.5" /> Download PDF
        </Button>
      </div>
    </div>
  );
};

export default ReportCard;
