import { AlertsBySeverity, AlertItem } from "../../types/apiTypes";
import StatusBadge from "../ui/StatusBadge";

interface AlertsListProps {
  alertsBySeverity?: AlertsBySeverity;
  loading: boolean;
  error?: string;
  onAlertClick: (alert: AlertItem) => void;
}

export default function AlertsList({ alertsBySeverity, loading, error, onAlertClick }: AlertsListProps) {
  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-raspink py-8">{error}</div>;
  if (!alertsBySeverity) return <div className="text-center py-8">No alerts found.</div>;

  return (
    <div className="space-y-6">
      {Object.entries(alertsBySeverity).map(([severity, alerts]) => (
        <div key={severity}>
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={severity} />
            <span className="font-heading text-lg capitalize">{severity}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.map((alert) => (
              <div
                key={alert.file_id}
                className="bg-midblck/80 rounded-lg p-4 shadow hover:bg-midblu/60 cursor-pointer transition"
                onClick={() => onAlertClick(alert)}
                tabIndex={0}
                role="button"
                aria-label={`View alert for ${alert.device_name}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{alert.device_name || "Device"}</span>
                  <StatusBadge status={severity} />
                </div>
                <div className="text-sm mt-1">
                  Expiry: {alert.warranty_end ? new Date(alert.warranty_end).toLocaleDateString() : "-"}
                </div>
                <div className="text-xs text-perspink mt-1">
                  {alert.days_until_expiry <= 0 ? "Expired" : `Expiring in ${alert.days_until_expiry} days`}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
