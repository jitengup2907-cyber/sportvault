import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/hooks/usePlan";
import {
  ClipboardList, Swords, FileText, Activity, Dumbbell,
  Trophy, DollarSign, LayoutDashboard, LogOut, Menu, X, Users, Settings, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/players", label: "Roster", icon: Users },
  { to: "/player-reports", label: "Reports", icon: ClipboardList },
  { to: "/match-reports", label: "Matches", icon: Swords },
  { to: "/contracts", label: "Contracts", icon: FileText },
  { to: "/injuries", label: "Injuries", icon: Activity },
  { to: "/training", label: "Training", icon: Dumbbell },
  { to: "/tournaments", label: "Tournaments", icon: Trophy },
  { to: "/finances", label: "Finances", icon: DollarSign },
  { to: "/settings", label: "Settings", icon: Settings },
];

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { plan } = usePlan();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const planBadgeColor = plan === "pro" ? "bg-blue-500" : plan === "club" ? "bg-primary" : "bg-amber-500";
  const planLabel = plan.toUpperCase();

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          <NavLink to="/dashboard" className="font-display font-extrabold text-lg text-primary tracking-tight">
            SportVault
          </NavLink>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${planBadgeColor}`}>
            {planLabel}
          </span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )
              }
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </NavLink>
          ))}
          {plan === "free" && (
            <Button size="sm" variant="outline" onClick={() => navigate("/pricing")} className="ml-1 text-xs text-amber-600 border-amber-300">
              <Zap className="h-3 w-3 mr-1" /> Upgrade
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="ml-2 text-xs text-muted-foreground">
            <LogOut className="h-3.5 w-3.5 mr-1" /> Sign Out
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-card px-4 py-3 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
          {plan === "free" && (
            <button onClick={() => { navigate("/pricing"); setMobileOpen(false); }} className="flex items-center gap-2 px-3 py-2 text-sm text-amber-600 font-medium w-full">
              <Zap className="h-4 w-4" /> Upgrade Plan
            </button>
          )}
          <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground w-full">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
