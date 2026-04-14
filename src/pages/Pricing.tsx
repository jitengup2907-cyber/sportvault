import { useState } from "react";
import { Check, ArrowRight, Zap, Crown, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import UpgradeModal from "@/components/UpgradeModal";

const plans = [
  {
    name: "Free", price: "₹0", period: "forever", color: "border-border",
    icon: Gift, badge: null,
    features: [
      "Up to 20 players",
      "10 AI report cards/month",
      "3 AI match reports/month",
      "Basic roster, injury log, attendance",
      "Watermarked PDF exports",
      "SportVault logo on PDFs",
    ],
    excluded: ["No contract builder", "No video uploads"],
    cta: "Get Started Free", ctaVariant: "outline" as const,
  },
  {
    name: "Club", price: "₹799", period: "/mo", color: "border-primary ring-2 ring-primary/20",
    icon: Zap, badge: "Most Popular",
    features: [
      "Up to 75 players",
      "Unlimited AI player reports",
      "Unlimited AI match reports",
      "5 contracts/month",
      "Clean PDF exports — no watermark",
      "Academy logo on all PDFs",
      "Finance, injury, training, tournaments",
    ],
    excluded: ["No video uploads", "No AI video analysis"],
    cta: "Upgrade to Club", ctaVariant: "default" as const,
  },
  {
    name: "Pro Analyst", price: "₹1,999", period: "/mo", color: "border-blue-500 ring-2 ring-blue-500/20",
    icon: Crown, badge: "Best Value",
    features: [
      "Unlimited players",
      "Everything in Club",
      "Match video uploads (5GB/mo)",
      "AI game/video analysis",
      "Unlimited contracts",
      "Custom academy branding",
      "AI sports assistant",
      "Shareable public report links",
      "Priority WhatsApp support",
    ],
    excluded: [],
    cta: "Upgrade to Pro", ctaVariant: "default" as const,
  },
];

const faqs = [
  { q: "Can I switch plans anytime?", a: "Yes. Upgrades apply immediately. Downgrades apply from the next billing cycle." },
  { q: "What sports does this cover?", a: "30+ sports including cricket, football, kabaddi, badminton, basketball, hockey, athletics, tennis, table tennis, boxing, wrestling, gymnastics, swimming, and more." },
  { q: "Do my players' reports stay if I downgrade?", a: "Yes. All your data is always yours. You just lose access to generating new ones beyond the free plan limits." },
  { q: "Is this good for pro clubs too?", a: "Absolutely. Our Pro plan is built for serious academies and professional clubs. Enterprise pricing is available for ISL clubs and state associations — email us at enterprise@sportvault.in" },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {!user && (
        <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
            <button onClick={() => navigate("/")} className="font-display font-extrabold text-lg text-primary">SportVault</button>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-foreground">Home</button>
              <button className="text-sm font-medium text-primary">Pricing</button>
              <Button size="sm" variant="outline" onClick={() => navigate("/auth")}>Sign In</Button>
              <Button size="sm" onClick={() => navigate("/auth")}>Get Started Free</Button>
            </div>
          </div>
        </nav>
      )}

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-extrabold text-foreground">Simple pricing. No setup fees. Your data, always yours.</h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Start free. Upgrade when you're ready. Every plan includes AI-powered sports documentation for 30+ sports.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-xl border-2 bg-card p-6 relative ${p.color}`}>
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  {p.badge}
                </span>
              )}
              <p.icon className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-display text-xl font-bold">{p.name}</h3>
              <p className="text-3xl font-extrabold text-foreground mt-1">{p.price}<span className="text-sm font-normal text-muted-foreground">{p.period}</span></p>

              <ul className="mt-5 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground"><Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />{f}</li>
                ))}
                {p.excluded.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground line-through"><span className="h-4 w-4 mt-0.5 flex-shrink-0" />{f}</li>
                ))}
              </ul>

              <Button
                className="w-full mt-6" variant={p.ctaVariant}
                onClick={() => {
                  if (p.name === "Free") navigate("/auth");
                  else if (user) setUpgradeOpen(true);
                  else navigate("/auth");
                }}
              >
                {p.cta} <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-16">
          <span>✓ No credit card for free plan</span>
          <span>✓ UPI, cards & net banking</span>
          <span>✓ Cancel anytime</span>
          <span>✓ No setup fees</span>
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border bg-card p-5">
                <h3 className="font-bold text-foreground text-sm">{faq.q}</h3>
                <p className="text-sm text-muted-foreground mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  );
};

export default Pricing;
