import { MatchData } from "@/types/match";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SPORT_NAMES, getSportConfig } from "@/types/sports";

interface MatchReportFormProps {
  match: MatchData;
  onChange: (updates: Partial<MatchData>) => void;
}

const MatchReportForm = ({ match, onChange }: MatchReportFormProps) => (
  <div className="rounded-xl border bg-card shadow-sm p-5 md:p-6 space-y-5">
    <h3 className="font-display text-lg font-bold text-foreground">Match Details</h3>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Your Team Name *</label>
        <Input placeholder="e.g. Champions FC" value={match.teamName} onChange={(e) => onChange({ teamName: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Opponent *</label>
        <Input placeholder="e.g. City United" value={match.opponentName} onChange={(e) => onChange({ opponentName: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Sport *</label>
        <Select value={match.sport} onValueChange={(v) => onChange({ sport: v })}>
          <SelectTrigger><SelectValue placeholder="Select sport" /></SelectTrigger>
          <SelectContent>
            {SPORT_NAMES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Match Date</label>
        <Input type="date" value={match.matchDate} onChange={(e) => onChange({ matchDate: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Venue</label>
        <Input placeholder="e.g. Home Ground" value={match.venue} onChange={(e) => onChange({ venue: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Result *</label>
        <Select value={match.result} onValueChange={(v: "win" | "loss" | "draw") => onChange({ result: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="win">✅ Win</SelectItem>
            <SelectItem value="loss">❌ Loss</SelectItem>
            <SelectItem value="draw">🤝 Draw</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Your Score</label>
        <Input placeholder="e.g. 3 or 245/6" value={match.scoreOwn} onChange={(e) => onChange({ scoreOwn: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Opponent Score</label>
        <Input placeholder="e.g. 1 or 210/10" value={match.scoreOpponent} onChange={(e) => onChange({ scoreOpponent: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Formation / Setup</label>
        <Input placeholder="e.g. 4-3-3 or 3 seamers + 2 spinners" value={match.formation} onChange={(e) => onChange({ formation: e.target.value })} />
      </div>
    </div>

    <h3 className="font-display text-lg font-bold text-foreground pt-2">Tactical Analysis</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Key Players & Performances *</label>
        <Textarea placeholder="e.g. Arjun: 3 goals, led attack. Priya: solid in defense" value={match.keyPlayers} onChange={(e) => onChange({ keyPlayers: e.target.value })} className="resize-none h-20" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Tactical Notes *</label>
        <Textarea placeholder="e.g. High press worked in first half, switched to counter in second" value={match.tacticalNotes} onChange={(e) => onChange({ tacticalNotes: e.target.value })} className="resize-none h-20" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Team Strengths in this Match</label>
        <Textarea placeholder="e.g. Ball retention in midfield, set-piece execution" value={match.strengthAreas} onChange={(e) => onChange({ strengthAreas: e.target.value })} className="resize-none h-20" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Areas to Improve</label>
        <Textarea placeholder="e.g. Transition defense, marking at corners" value={match.weaknessAreas} onChange={(e) => onChange({ weaknessAreas: e.target.value })} className="resize-none h-20" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Substitutions</label>
        <Textarea placeholder="e.g. Rahul on for Vikas at 60', impact sub brought energy" value={match.substitutions} onChange={(e) => onChange({ substitutions: e.target.value })} className="resize-none h-16" />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium">Injuries / Notes</label>
        <Textarea placeholder="e.g. Minor ankle twist for Neha in 2nd half" value={match.injuries} onChange={(e) => onChange({ injuries: e.target.value })} className="resize-none h-16" />
      </div>
    </div>

    <div className="space-y-1.5">
      <label className="text-sm font-medium">Coach's Remarks</label>
      <Textarea placeholder="Overall thoughts on the match, morale, team spirit..." value={match.coachRemarks} onChange={(e) => onChange({ coachRemarks: e.target.value })} className="resize-none h-20" />
    </div>
  </div>
);

export default MatchReportForm;
