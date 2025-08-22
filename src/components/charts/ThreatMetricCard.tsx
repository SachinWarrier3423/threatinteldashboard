import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ThreatMetricCardProps {
  title: string;
  value: number;
  total: number;
  subtitle: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  color?: "primary" | "success" | "warning" | "danger" | "accent";
  className?: string;
}

const colorVariants = {
  primary: "text-primary border-primary/20 bg-primary/10",
  success: "text-cyber-green border-cyber-green/20 bg-cyber-green/10",
  warning: "text-cyber-orange border-cyber-orange/20 bg-cyber-orange/10",
  danger: "text-destructive border-destructive/20 bg-destructive/10",
  accent: "text-accent border-accent/20 bg-accent/10",
};

const progressVariants = {
  primary: "bg-primary",
  success: "bg-cyber-green",
  warning: "bg-cyber-orange", 
  danger: "bg-destructive",
  accent: "bg-accent",
};

export function ThreatMetricCard({
  title,
  value,
  total,
  subtitle,
  trend,
  trendValue,
  color = "primary",
  className,
}: ThreatMetricCardProps) {
  const percentage = (value / total) * 100;

  return (
    <Card className={cn("cyber-card cyber-glow", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className={cn("text-3xl font-bold", colorVariants[color])}>
              {value.toLocaleString()}
            </div>
            {trend && trendValue && (
              <div
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  trend === "up" && "bg-cyber-green/20 text-cyber-green",
                  trend === "down" && "bg-destructive/20 text-destructive",
                  trend === "stable" && "bg-muted/20 text-muted-foreground"
                )}
              >
                {trendValue}
              </div>
            )}
          </div>
          
          {/* Circular Progress Visualization */}
          <div className="relative w-20 h-20 mx-auto">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-muted/30"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={cn(progressVariants[color])}
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={`${percentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn("text-sm font-bold", colorVariants[color])}>
                {Math.round(percentage)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}