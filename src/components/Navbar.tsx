import { NavLink } from "react-router-dom";
import { ClipboardList, Swords, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home", icon: ClipboardList },
  { to: "/player-reports", label: "Player Reports", icon: ClipboardList },
  { to: "/match-reports", label: "Match Reports", icon: Swords },
];

const Navbar = () => (
  <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
    <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
      <span className="font-display font-extrabold text-lg text-primary tracking-tight">
        CoachReport
      </span>
      <div className="flex items-center gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  </nav>
);

export default Navbar;
