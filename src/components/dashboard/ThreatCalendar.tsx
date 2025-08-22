import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for threat events
const threatEvents = {
  '2024-01-15': { count: 3, severity: 'high' },
  '2024-01-16': { count: 7, severity: 'critical' },
  '2024-01-17': { count: 2, severity: 'medium' },
  '2024-01-18': { count: 5, severity: 'high' },
  '2024-01-19': { count: 1, severity: 'low' },
  '2024-01-20': { count: 12, severity: 'critical' },
  '2024-01-21': { count: 4, severity: 'medium' },
  '2024-01-22': { count: 8, severity: 'high' },
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

interface ThreatCalendarProps {
  className?: string;
}

export function ThreatCalendar({ className }: ThreatCalendarProps) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive';
      case 'high': return 'bg-cyber-pink';
      case 'medium': return 'bg-cyber-orange';
      case 'low': return 'bg-cyber-green';
      default: return '';
    }
  };

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  return (
    <Card className={cn("cyber-card", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Threat Timeline</span>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[100px] text-center">
              {monthNames[month]} {year}
            </span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the first day of the month */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="h-8"></div>
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = formatDate(day);
            const event = threatEvents[dateStr];
            const isToday = day === currentDate.getDate() && 
                           month === currentDate.getMonth() && 
                           year === currentDate.getFullYear();

            return (
              <div
                key={day}
                className={cn(
                  "relative h-8 flex items-center justify-center text-sm cursor-pointer rounded transition-colors",
                  isToday && "bg-primary text-primary-foreground font-bold",
                  !isToday && "hover:bg-muted",
                  event && !isToday && "text-foreground"
                )}
              >
                <span className="relative z-10">{day}</span>
                {event && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full opacity-30",
                        getSeverityColor(event.severity)
                      )}
                    ></div>
                  </div>
                )}
                {event && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-foreground text-[8px] flex items-center justify-center">
                    {event.count > 9 ? '9+' : event.count}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-4 border-t border-border">
          <div className="text-xs font-medium text-muted-foreground mb-2">Threat Severity</div>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-cyber-green"></div>
              <span className="text-xs text-muted-foreground">Low</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-cyber-orange"></div>
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-cyber-pink"></div>
              <span className="text-xs text-muted-foreground">High</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-xs text-muted-foreground">Critical</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}