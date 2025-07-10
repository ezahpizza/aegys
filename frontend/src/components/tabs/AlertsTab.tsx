import { useAlertsStore } from "../../stores/alertsStore";
import AlertsList from "../alerts/AlertsList";
import AlertCardModal from "@/components/modals/AlertCardModal";
import { useState } from "react";

export default function AlertsTab({ userId }: { userId: string }) {
  const { bySeverity, loading, error } = useAlertsStore();
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  return (
    <div className="w-full">
      <AlertsList
        alertsBySeverity={bySeverity}
        loading={loading}
        error={error}
        onAlertClick={setSelectedAlert}
      />
      <AlertCardModal
        open={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        alert={selectedAlert}
      />
    </div>
  );
}