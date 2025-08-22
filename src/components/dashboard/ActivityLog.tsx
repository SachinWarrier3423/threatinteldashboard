import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Shield, Zap, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: 'threat' | 'detection' | 'analysis' | 'investigation';
  title: string;
  description: string;
  time: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'threat',
    title: 'Malicious IP Blocked',
    description: 'Blocked suspicious traffic from 192.168.1.100',
    time: '2 minutes ago',
    severity: 'high',
    source: 'Firewall'
  },
  {
    id: '2',
    type: 'detection',
    title: 'Phishing Domain Detected',
    description: 'Domain fake-bank.com identified as phishing',
    time: '5 minutes ago',
    severity: 'critical',
    source: 'DNS Monitor'
  },
  {
    id: '3',
    type: 'analysis',
    title: 'Threat Intel Update',
    description: '50 new IOCs added from ThreatConnect feed',
    time: '12 minutes ago',
    severity: 'medium',
    source: 'Feed Parser'
  },
  {
    id: '4',
    type: 'investigation',
    title: 'Malware Analysis Complete',
    description: 'Sample analysis completed for suspicious.exe',
    time: '18 minutes ago',
    severity: 'high',
    source: 'Sandbox'
  },
  {
    id: '5',
    type: 'detection',
    title: 'Botnet Communication',
    description: 'Detected C2 communication to known botnet',
    time: '25 minutes ago',
    severity: 'critical',
    source: 'Network Monitor'
  },
  {
    id: '6',
    type: 'threat',
    title: 'Ransomware Signature',
    description: 'File behavior matches ransomware patterns',
    time: '32 minutes ago',
    severity: 'critical',
    source: 'EDR'
  },
];

const severityColors = {
  low: 'bg-cyber-green/20 text-cyber-green border-cyber-green/30',
  medium: 'bg-cyber-orange/20 text-cyber-orange border-cyber-orange/30',
  high: 'bg-cyber-pink/20 text-cyber-pink border-cyber-pink/30',
  critical: 'bg-destructive/20 text-destructive border-destructive/30',
};

const typeIcons = {
  threat: AlertTriangle,
  detection: Shield,
  analysis: Zap,
  investigation: Eye,
};

interface ActivityLogProps {
  className?: string;
}

export function ActivityLog({ className }: ActivityLogProps) {
  return (
    <Card className={cn("cyber-card", className)}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80 px-6 pb-6">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = typeIcons[activity.type];
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      activity.severity === 'critical' && "bg-destructive/20",
                      activity.severity === 'high' && "bg-cyber-pink/20",
                      activity.severity === 'medium' && "bg-cyber-orange/20",
                      activity.severity === 'low' && "bg-cyber-green/20"
                    )}>
                      <Icon className={cn(
                        "w-4 h-4",
                        activity.severity === 'critical' && "text-destructive",
                        activity.severity === 'high' && "text-cyber-pink",
                        activity.severity === 'medium' && "text-cyber-orange",
                        activity.severity === 'low' && "text-cyber-green"
                      )} />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.title}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={cn("ml-2 text-xs", severityColors[activity.severity])}
                      >
                        {activity.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {activity.source}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}