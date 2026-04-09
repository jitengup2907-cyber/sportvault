import { REPORT_TEMPLATES, REPORT_TONES, ReportTemplate, ReportTone } from "@/types/template";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  selectedTemplate: string;
  selectedTone: ReportTone;
  onTemplateChange: (id: string) => void;
  onToneChange: (tone: ReportTone) => void;
}

const TemplateSelector = ({ selectedTemplate, selectedTone, onTemplateChange, onToneChange }: TemplateSelectorProps) => (
  <div className="space-y-4">
    <div>
      <label className="text-sm font-medium mb-2 block">Report Template</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {REPORT_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTemplateChange(t.id)}
            className={cn(
              "rounded-lg border-2 p-3 text-left transition-all hover:shadow-md",
              selectedTemplate === t.id ? "border-primary shadow-md" : "border-border"
            )}
          >
            <div className="flex gap-1 mb-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.primaryColor }} />
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.headerBg }} />
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.accentColor }} />
            </div>
            <p className="text-xs font-semibold">{t.name}</p>
            <p className="text-[10px] text-muted-foreground">{t.description}</p>
          </button>
        ))}
      </div>
    </div>

    <div>
      <label className="text-sm font-medium mb-2 block">Report Tone</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {REPORT_TONES.map((tone) => (
          <button
            key={tone.value}
            type="button"
            onClick={() => onToneChange(tone.value)}
            className={cn(
              "rounded-lg border-2 p-3 text-left transition-all",
              selectedTone === tone.value ? "border-primary bg-primary/5" : "border-border"
            )}
          >
            <p className="text-sm font-semibold">{tone.label}</p>
            <p className="text-[10px] text-muted-foreground">{tone.description}</p>
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default TemplateSelector;
