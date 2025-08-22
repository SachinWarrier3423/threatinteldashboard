import { ThreatMetricCard } from "@/components/charts/ThreatMetricCard";
import { ThreatTrendChart } from "@/components/charts/ThreatTrendChart";
import { ThreatTypesChart } from "@/components/charts/ThreatTypesChart";
import { ActivityLog } from "@/components/dashboard/ActivityLog";
import { ThreatCalendar } from "@/components/dashboard/ThreatCalendar";
import { SeverityRadials } from "@/components/dashboard/SeverityRadials";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Threat Intelligence Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and analyze cybersecurity threats in real-time
        </p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ThreatMetricCard
          title="Total Threat Feeds"
          value={1544}
          total={2000}
          subtitle="Collected this month"
          trend="up"
          trendValue="+12.5%"
          color="primary"
        />
        <ThreatMetricCard
          title="Malicious IPs Detected"
          value={2487}
          total={3000}
          subtitle="Blocked in 24h"
          trend="down"
          trendValue="-8.3%"
          color="danger"
        />
        <ThreatMetricCard
          title="Suspicious Domains"
          value={1544}
          total={2000}
          subtitle="Flagged for review"
          trend="up"
          trendValue="+15.2%"
          color="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatTrendChart />
        <ThreatTypesChart />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityLog />
        <ThreatCalendar />
        <SeverityRadials />
      </div>
    </div>
  );
}