import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Shield,
  AlertTriangle,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Threat Feeds", href: "/threat-feeds", icon: Shield },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

const projects = [
  { name: "Options", href: "/projects/options" },
  { name: "Case", href: "/projects/case" },
  { name: "Local", href: "/projects/local" },
];

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-border bg-card/50 backdrop-blur-xl",
        isCollapsed ? "w-16" : "w-64",
        "transition-all duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-cyber flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-cyber bg-clip-text text-transparent">
              ThreatIntel
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary/20 text-primary shadow-glow-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon
              className={cn(
                "mr-3 h-5 w-5 flex-shrink-0",
                isCollapsed && "mr-0"
              )}
            />
            {!isCollapsed && <span>{item.name}</span>}
          </NavLink>
        ))}

        {/* Projects Section */}
        {!isCollapsed && (
          <div className="mt-8">
            <button
              onClick={() => setIsProjectsOpen(!isProjectsOpen)}
              className="group flex w-full items-center px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors"
            >
              {isProjectsOpen ? (
                <ChevronDown className="mr-2 h-4 w-4" />
              ) : (
                <ChevronRight className="mr-2 h-4 w-4" />
              )}
              <span className="text-xs font-semibold uppercase tracking-wider">
                Projects
              </span>
            </button>
            {isProjectsOpen && (
              <div className="mt-2 space-y-1">
                {projects.map((project) => (
                  <NavLink
                    key={project.name}
                    to={project.href}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-colors",
                        isActive && "text-primary"
                      )
                    }
                  >
                    <span>{project.name}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}