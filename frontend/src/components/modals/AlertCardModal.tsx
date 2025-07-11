import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { AlertItem } from "../../types/apiTypes";

interface AlertCardModalProps {
  open: boolean;
  onClose: () => void;
  alert?: AlertItem;
}

export default function AlertCardModal({ open, onClose, alert }: AlertCardModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white border-none rounded-xl shadow-xl p-6">
        <div className="w-full">
          <DialogHeader className="font-heading text-lg mb-2">Alert Details</DialogHeader>
          {alert && typeof alert === 'object' ? (
            <div className="space-y-2 text-midblck">
              <div className="flex justify-between border-b py-1">
                <span className="font-semibold">Device</span>
                <span>{(alert as AlertItem).device_name || "-"}</span>
              </div>
              <div className="flex justify-between border-b py-1">
                <span className="font-semibold">Warranty End</span>
                <span>{(alert as AlertItem).warranty_end ? new Date((alert as AlertItem).warranty_end).toLocaleDateString() : "-"}</span>
              </div>
              <div className="flex justify-between border-b py-1">
                <span className="font-semibold">Days Until Expiry</span>
                <span>{(alert as AlertItem).days_until_expiry}</span>
              </div>
            </div>
          ) : (
            <div className="text-center">No alert data.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
