import { PlayerData } from "@/types/player";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import StarRating from "./StarRating";
import { Trash2 } from "lucide-react";

interface PlayerFormProps {
  player: PlayerData;
  index: number;
  onChange: (id: string, field: keyof PlayerData, value: string | number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

const PlayerForm = ({ player, index, onChange, onRemove, canRemove }: PlayerFormProps) => {
  return (
    <div className="rounded-xl border bg-card p-5 md:p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground">
          Player {index + 1}
        </h3>
        {canRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(player.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Player Name</label>
          <Input
            placeholder="e.g. Arjun Sharma"
            value={player.playerName}
            onChange={(e) => onChange(player.id, "playerName", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Age</label>
          <Input
            type="number"
            placeholder="e.g. 12"
            value={player.age || ""}
            onChange={(e) => onChange(player.id, "age", parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Sport</label>
          <Select value={player.sport} onValueChange={(v) => onChange(player.id, "sport", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cricket">Cricket</SelectItem>
              <SelectItem value="Football">Football</SelectItem>
              <SelectItem value="Badminton">Badminton</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Position / Role</label>
          <Input
            placeholder="e.g. Batsman, Striker"
            value={player.position}
            onChange={(e) => onChange(player.id, "position", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Sessions Attended</label>
          <Input
            type="number"
            placeholder="e.g. 18"
            value={player.sessionsAttended || ""}
            onChange={(e) => onChange(player.id, "sessionsAttended", parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Total Sessions This Month</label>
          <Input
            type="number"
            placeholder="e.g. 22"
            value={player.totalSessions || ""}
            onChange={(e) => onChange(player.id, "totalSessions", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StarRating
          label="Ball Control / Skill"
          value={player.skillRating}
          onChange={(v) => onChange(player.id, "skillRating", v)}
        />
        <StarRating
          label="Fitness & Stamina"
          value={player.fitnessRating}
          onChange={(v) => onChange(player.id, "fitnessRating", v)}
        />
        <StarRating
          label="Teamwork & Attitude"
          value={player.teamworkRating}
          onChange={(v) => onChange(player.id, "teamworkRating", v)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Strength Note</label>
          <Textarea
            placeholder="e.g. Never gives up, very coachable"
            maxLength={100}
            value={player.strengthNote}
            onChange={(e) => onChange(player.id, "strengthNote", e.target.value)}
            className="resize-none h-20"
          />
          <span className="text-xs text-muted-foreground">{player.strengthNote.length}/100</span>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Improvement Area</label>
          <Textarea
            placeholder="e.g. Needs to improve first touch"
            maxLength={100}
            value={player.improvementNote}
            onChange={(e) => onChange(player.id, "improvementNote", e.target.value)}
            className="resize-none h-20"
          />
          <span className="text-xs text-muted-foreground">{player.improvementNote.length}/100</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium">Standout Moment This Month <span className="text-muted-foreground">(optional)</span></label>
        <Textarea
          placeholder="e.g. Scored a hat-trick in the inter-academy match"
          maxLength={100}
          value={player.standoutMoment}
          onChange={(e) => onChange(player.id, "standoutMoment", e.target.value)}
          className="resize-none h-20"
        />
        <span className="text-xs text-muted-foreground">{player.standoutMoment.length}/100</span>
      </div>
    </div>
  );
};

export default PlayerForm;
