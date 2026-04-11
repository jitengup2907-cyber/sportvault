import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  ClipboardList, Swords, FileText, Activity, Dumbbell,
  Trophy, DollarSign, LayoutDashboard, LogOut, Menu, X, Users
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
];

const Navbar = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <NavLink to="/dashboard" className="font-display font-extrabold text-lg text-primary tracking-tight">
          CoachReport
        </NavLink>

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
          <button onClick={handleSignOut} className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground w-full">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
