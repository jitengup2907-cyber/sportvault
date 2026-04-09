import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface LogoUploadProps {
  logoDataUrl?: string;
  onLogoChange: (dataUrl: string | undefined) => void;
}

const LogoUpload = ({ logoDataUrl, onLogoChange }: LogoUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Logo must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onLogoChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">Academy Logo <span className="text-muted-foreground">(optional)</span></label>
      {logoDataUrl ? (
        <div className="flex items-center gap-3">
          <img src={logoDataUrl} alt="Logo" className="h-12 w-12 rounded-lg object-contain border bg-card" />
          <Button variant="ghost" size="sm" onClick={() => onLogoChange(undefined)} className="text-muted-foreground hover:text-destructive">
            <X className="h-4 w-4 mr-1" /> Remove
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors w-full"
        >
          <Upload className="h-4 w-4" />
          Upload logo (PNG, JPG, max 2MB)
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFile} />
    </div>
  );
};

export default LogoUpload;
