import { PlayerData, AcademyInfo, RATING_CATEGORIES } from "@/types/player";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import StarRating from "./StarRating";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { SPORT_NAMES, getSportPositions } from "@/types/sports";
import { useState } from "react";

interface PlayerFormProps {
  player: PlayerData;
  index: number;
  onChange: (id: string, updates: Partial<PlayerData>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

const DIMENSION_LABELS = {
  physical: { label: "Physical", emoji: "💪" },
  mental: { label: "Mental", emoji: "🧠" },
  social: { label: "Social", emoji: "🤝" },
};

const GROUP_LABELS = {
  "on-pitch": "On the Pitch",
  "off-pitch": "Off the Pitch",
};

const PlayerForm = ({ player, index, onChange, onRemove, canRemove }: PlayerFormProps) => {
  const [expanded, setExpanded] = useState(true);

  const updateField = (field: keyof PlayerData, value: string | number) => {
    onChange(player.id, { [field]: value });
  };

  const updateRating = (key: string, value: number) => {
    onChange(player.id, { ratings: { ...player.ratings, [key]: value } });
  };

  const groups = ["on-pitch", "off-pitch"] as const;
  const dimensions = ["physical", "mental", "social"] as const;

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
            {index + 1}
          </span>
          <h3 className="font-display text-lg font-bold text-foreground">
            {player.playerName || `Player ${index + 1}`}
          </h3>
          {player.sport && (
            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
              {player.sport}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onRemove(player.id); }}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-6 space-y-5 border-t">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Player Name *</label>
              <Input placeholder="e.g. Arjun Sharma" value={player.playerName} onChange={(e) => updateField("playerName", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Age *</label>
              <Input type="number" placeholder="e.g. 12" value={player.age || ""} onChange={(e) => updateField("age", parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Sport *</label>
              <Select value={player.sport} onValueChange={(v) => updateField("sport", v)}>
                <SelectTrigger><SelectValue placeholder="Select sport" /></SelectTrigger>
                <SelectContent>
                  {SPORT_NAMES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Position / Role *</label>
              <Input placeholder="e.g. Batsman, Striker" value={player.position} onChange={(e) => updateField("position", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Sessions Attended</label>
              <Input type="number" placeholder="e.g. 18" value={player.sessionsAttended || ""} onChange={(e) => updateField("sessionsAttended", parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Total Sessions</label>
              <Input type="number" placeholder="e.g. 22" value={player.totalSessions || ""} onChange={(e) => updateField("totalSessions", parseInt(e.target.value) || 0)} />
            </div>
          </div>

          {/* Ratings Grid */}
          {groups.map((group) => (
            <div key={group} className="space-y-3">
              <h4 className="font-display font-bold text-base text-foreground border-b pb-2">
                {GROUP_LABELS[group]}
              </h4>
              <div className="space-y-4">
                {dimensions.map((dim) => {
                  const cats = RATING_CATEGORIES.filter((c) => c.group === group && c.dimension === dim);
                  if (cats.length === 0) return null;
                  const { emoji, label } = DIMENSION_LABELS[dim];
                  return (
                    <div key={`${group}-${dim}`}>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">
                        {emoji} {label}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {cats.map((cat) => (
                          <StarRating
                            key={cat.key}
                            label={cat.label}
                            value={player.ratings[cat.key] || 0}
                            onChange={(v) => updateRating(cat.key, v)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Key Strength *</label>
              <Textarea placeholder="e.g. Never gives up, very coachable" maxLength={150} value={player.strengthNote} onChange={(e) => updateField("strengthNote", e.target.value)} className="resize-none h-20" />
              <span className="text-xs text-muted-foreground">{player.strengthNote.length}/150</span>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Improvement Area *</label>
              <Textarea placeholder="e.g. Needs to improve first touch" maxLength={150} value={player.improvementNote} onChange={(e) => updateField("improvementNote", e.target.value)} className="resize-none h-20" />
              <span className="text-xs text-muted-foreground">{player.improvementNote.length}/150</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Standout Moment <span className="text-muted-foreground">(optional)</span></label>
              <Textarea placeholder="e.g. Scored a hat-trick in the inter-academy match" maxLength={150} value={player.standoutMoment} onChange={(e) => updateField("standoutMoment", e.target.value)} className="resize-none h-20" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Goals for Next Period <span className="text-muted-foreground">(optional)</span></label>
              <Textarea placeholder="e.g. Work on defensive positioning and reaction time" maxLength={150} value={player.goals} onChange={(e) => updateField("goals", e.target.value)} className="resize-none h-20" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerForm;
