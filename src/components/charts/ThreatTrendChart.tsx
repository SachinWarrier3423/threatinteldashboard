import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan 01', threats: 120, malware: 45, phishing: 30, ddos: 25, ransomware: 20 },
  { name: 'Jan 02', threats: 180, malware: 65, phishing: 45, ddos: 35, ransomware: 35 },
  { name: 'Jan 03', threats: 320, malware: 120, phishing: 80, ddos: 60, ransomware: 60 },
  { name: 'Jan 04', threats: 280, malware: 100, phishing: 70, ddos: 55, ransomware: 55 },
  { name: 'Jan 05', threats: 450, malware: 180, phishing: 120, ddos: 75, ransomware: 75 },
  { name: 'Jan 06', threats: 380, malware: 140, phishing: 95, ddos: 70, ransomware: 75 },
  { name: 'Jan 07', threats: 520, malware: 200, phishing: 130, ddos: 90, ransomware: 100 },
];

interface ThreatTrendChartProps {
  className?: string;
}

export function ThreatTrendChart({ className }: ThreatTrendChartProps) {
  return (
    <Card className={`cyber-card ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Threat Activity Trends</span>
          <div className="flex space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Total Threats</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="threats" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2, fill: 'hsl(var(--background))' }}
              />
              <Line 
                type="monotone" 
                dataKey="malware" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="phishing" 
                stroke="hsl(var(--cyber-orange))" 
                strokeWidth={2}
                strokeDasharray="5 5" 
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="ddos" 
                stroke="hsl(var(--cyber-blue))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}