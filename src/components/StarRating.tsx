import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

const StarRating = ({ value, onChange, label }: StarRatingProps) => {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                star <= value
                  ? "fill-primary text-primary"
                  : "fill-muted text-border"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRating;
