import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SeverityLevel {
  name: string;
  percentage: number;
  color: string;
  count: number;
}

const severityData: SeverityLevel[] = [
  { name: 'Critical', percentage: 15, color: 'hsl(var(--destructive))', count: 23 },
  { name: 'High', percentage: 35, color: 'hsl(var(--cyber-pink))', count: 67 },
  { name: 'Medium', percentage: 30, color: 'hsl(var(--cyber-orange))', count: 89 },
  { name: 'Low', percentage: 20, color: 'hsl(var(--cyber-green))', count: 45 },
];

interface RadialProgressProps {
  percentage: number;
  color: string;
  size?: number;
}

function RadialProgress({ percentage, color, size = 60 }: RadialProgressProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth="3"
          fill="transparent"
          className="opacity-20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-foreground">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

interface SeverityRadialsProps {
  className?: string;
}

export function SeverityRadials({ className }: SeverityRadialsProps) {
  return (
    <Card className={cn("cyber-card", className)}>
      <CardHeader>
        <CardTitle>Threat Severity Levels</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {severityData.map((level, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RadialProgress 
                percentage={level.percentage} 
                color={level.color}
                size={50}
              />
              <div>
                <div className="font-medium text-sm">{level.name}</div>
                <div className="text-xs text-muted-foreground">
                  {level.count} threats
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold" style={{ color: level.color }}>
                {level.percentage}%
              </div>
            </div>
          </div>
        ))}

        {/* Summary */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Threats</span>
            <span className="font-bold text-foreground">
              {severityData.reduce((acc, level) => acc + level.count, 0)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-muted-foreground">Active Investigations</span>
            <span className="font-bold text-accent">12</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}