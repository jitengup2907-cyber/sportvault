import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Crown, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message?: string;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  {
    id: "club" as const,
    name: "Club",
    price: "₹799",
    color: "border-primary bg-primary/5",
    icon: Zap,
    features: [
      "Up to 75 players",
      "Unlimited AI reports",
      "5 contracts/month",
      "Academy logo on PDFs",
      "No watermark",
      "Full management suite",
    ],
  },
  {
    id: "pro" as const,
    name: "Pro Analyst",
    price: "₹1,999",
    color: "border-blue-500 bg-blue-500/5",
    icon: Crown,
    features: [
      "Unlimited everything",
      "Match video uploads",
      "AI video analysis",
      "Shareable report links",
      "Custom branding",
      "Priority support",
    ],
  },
];

const UpgradeModal = ({ open, onOpenChange, message, onSuccess }: UpgradeModalProps) => {
  const { user } = useAuth();
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const handleUpgrade = async (planId: "club" | "pro") => {
    if (!user) return;
    setUpgrading(planId);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const res = await fetch(`${supabaseUrl}/functions/v1/create-razorpay-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
        body: JSON.stringify({ plan: planId, userId: user.id }),
      });

      if (!res.ok) throw new Error("Failed to create order");
      const { orderId, amount, currency, keyId } = await res.json();

      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://checkout.razorpay.com/v1/checkout.js";
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Failed to load Razorpay"));
          document.head.appendChild(s);
        });
      }

      const planLabel = planId === "club" ? "Club" : "Pro Analyst";
      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: "SportVault",
        description: `${planLabel} Plan — Monthly Subscription`,
        order_id: orderId,
        prefill: { email: user.email },
        theme: { color: "#1B4D3E" },
        handler: async (response: any) => {
          const verifyRes = await fetch(`${supabaseUrl}/functions/v1/verify-razorpay-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${supabaseKey}` },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.id,
              plan: planId,
            }),
          });
          const result = await verifyRes.json();
          if (result.success) {
            toast.success(`Welcome to ${planLabel}! Your account has been upgraded.`);
            onOpenChange(false);
            onSuccess?.();
          } else {
            toast.error("Payment verification failed. Contact support.");
          }
          setUpgrading(null);
        },
        modal: { ondismiss: () => setUpgrading(null) },
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Failed to initiate payment");
      setUpgrading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Upgrade Your Plan</DialogTitle>
        </DialogHeader>
        {message && <p className="text-sm text-muted-foreground -mt-2">{message}</p>}

        <div className="grid grid-cols-2 gap-3 mt-2">
          {plans.map((p) => (
            <div key={p.id} className={`rounded-xl border-2 p-4 ${p.color}`}>
              <p.icon className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-bold text-foreground">{p.name}</h3>
              <p className="text-lg font-extrabold text-foreground">{p.price}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
              <ul className="mt-3 space-y-1.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full mt-4" size="sm"
                variant={p.id === "club" ? "default" : "outline"}
                disabled={upgrading !== null}
                onClick={() => handleUpgrade(p.id)}
              >
                {upgrading === p.id ? "Processing..." : `Upgrade — ${p.price}/mo`}
              </Button>
            </div>
          ))}
        </div>

        <button onClick={() => onOpenChange(false)} className="text-xs text-muted-foreground text-center mt-1 hover:underline">
          Maybe later
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
