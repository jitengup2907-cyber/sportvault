import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(-1)}
      className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      Back
    </Button>
  );
};

export default BackButton;
