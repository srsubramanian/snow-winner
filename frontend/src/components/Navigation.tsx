import { NavLink } from "react-router-dom";
import { LayoutDashboard, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center gap-6">
          <div className="font-semibold text-lg">SNOW Compliance</div>
          <div className="flex gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <MessageSquare className="h-4 w-4" />
              Chat Assistant
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
