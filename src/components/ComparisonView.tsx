import { SavedReport, RATING_CATEGORIES } from "@/types/player";
import { Star, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ComparisonViewProps {
  playerName: string;
  history: SavedReport[];
}

const ComparisonView = ({ playerName, history }: ComparisonViewProps) => {
  if (history.length < 2) {
    return (
      <div className="text-sm text-muted-foreground text-center py-6">
        Need at least 2 reports to compare. Generate reports for different months to see progress.
      </div>
    );
  }

  // Sort by generatedAt ascending
  const sorted = [...history].sort((a, b) => new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime());
  const latest = sorted[sorted.length - 1];
  const previous = sorted[sorted.length - 2];

  const groups = ["on-pitch", "off-pitch"] as const;
  const dimensions = ["physical", "mental", "social"] as const;
  const dimLabels: Record<string, string> = { physical: "💪 Physical", mental: "🧠 Mental", social: "🤝 Social" };

  const computeGroupAvg = (ratings: Record<string, number>, group: string) => {
    const cats = RATING_CATEGORIES.filter((c) => c.group === group);
    const rated = cats.filter((c) => (ratings[c.key] || 0) > 0);
    if (rated.length === 0) return 0;
    return rated.reduce((sum, c) => sum + (ratings[c.key] || 0), 0) / rated.length;
  };

  const TrendIcon = ({ diff }: { diff: number }) => {
    if (diff > 0) return <TrendingUp className="h-4 w-4 text-primary" />;
    if (diff < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const DiffBadge = ({ diff }: { diff: number }) => {
    if (diff === 0) return <span className="text-xs text-muted-foreground">—</span>;
    const color = diff > 0 ? "text-primary bg-primary/10" : "text-destructive bg-destructive/10";
    return (
      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${color}`}>
        {diff > 0 ? "+" : ""}{diff.toFixed(1)}
      </span>
    );
  };

  const latestOverall = (computeGroupAvg(latest.ratings, "on-pitch") + computeGroupAvg(latest.ratings, "off-pitch")) / 2;
  const prevOverall = (computeGroupAvg(previous.ratings, "on-pitch") + computeGroupAvg(previous.ratings, "off-pitch")) / 2;
  const overallDiff = latestOverall - prevOverall;

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="bg-primary/5 px-5 py-4 border-b">
        <h3 className="font-display text-lg font-bold text-foreground">{playerName} — Progress Comparison</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {previous.periodLabel} → {latest.periodLabel}
        </p>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-2">
            <TrendIcon diff={overallDiff} />
            <span className="text-sm font-medium">Overall: {prevOverall.toFixed(1)} → {latestOverall.toFixed(1)}</span>
            <DiffBadge diff={overallDiff} />
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        {/* Summary bars */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          {groups.map((group) => {
            const latestAvg = computeGroupAvg(latest.ratings, group);
            const prevAvg = computeGroupAvg(previous.ratings, group);
            const diff = latestAvg - prevAvg;
            return (
              <div key={group} className="rounded-lg bg-secondary/30 p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {group === "on-pitch" ? "⚡ On-Pitch" : "🏠 Off-Pitch"}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-display font-bold text-foreground">{latestAvg.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">from {prevAvg.toFixed(1)}</span>
                  <DiffBadge diff={diff} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail table */}
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {group === "on-pitch" ? "⚡ On the Pitch" : "🏠 Off the Pitch"}
              </h4>
              {dimensions.map((dim) => {
                const cats = RATING_CATEGORIES.filter((c) => c.group === group && c.dimension === dim);
                if (cats.length === 0) return null;
                return (
                  <div key={dim} className="mb-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">{dimLabels[dim]}</p>
                    <div className="space-y-1">
                      {cats.map((cat) => {
                        const prev = previous.ratings[cat.key] || 0;
                        const curr = latest.ratings[cat.key] || 0;
                        const diff = curr - prev;
                        return (
                          <div key={cat.key} className="flex items-center justify-between text-sm py-1">
                            <span className="text-foreground text-xs">{cat.label}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground">{prev > 0 ? prev : "—"}</span>
                              <span className="text-xs text-muted-foreground">→</span>
                              <span className="text-xs font-medium text-foreground">{curr > 0 ? curr : "—"}</span>
                              {prev > 0 && curr > 0 && <DiffBadge diff={diff} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* All periods quick view */}
        {sorted.length > 2 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              All Periods
            </h4>
            <div className="flex flex-wrap gap-2">
              {sorted.map((r) => {
                const avg = (computeGroupAvg(r.ratings, "on-pitch") + computeGroupAvg(r.ratings, "off-pitch")) / 2;
                return (
                  <div key={r.generatedAt} className="bg-secondary/30 rounded-lg px-3 py-2 text-center">
                    <p className="text-xs text-muted-foreground">{r.periodLabel}</p>
                    <p className="text-sm font-bold text-foreground">{avg.toFixed(1)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonView;
