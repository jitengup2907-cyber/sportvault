import { useNavigate } from "react-router-dom";

const LandingFooter = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t bg-card py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <span className="font-display font-extrabold text-lg text-primary">SportVault</span>
            <p className="text-sm text-muted-foreground mt-2">From grassroots to glory.</p>
            <p className="text-xs text-muted-foreground mt-3">Made in India 🇮🇳 for sports worldwide</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-sm text-foreground mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-foreground">Features</button></li>
              <li><button onClick={() => navigate("/pricing")} className="hover:text-foreground">Pricing</button></li>
              <li><button onClick={() => navigate("/video-analysis")} className="hover:text-foreground">Video Analysis</button></li>
              <li><button onClick={() => document.getElementById("sports")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-foreground">Sports</button></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm text-foreground mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:support@sportvault.in" className="hover:text-foreground">Contact</a></li>
              <li><a href="mailto:enterprise@sportvault.in" className="hover:text-foreground">Enterprise</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-sm text-foreground mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} SportVault. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
