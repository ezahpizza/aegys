import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertItem } from "../../types/apiTypes";

interface AlertCardModalProps {
  open: boolean;
  onClose: () => void;
  alert?: AlertItem;
}

export default function AlertCardModal({ open, onClose, alert }: AlertCardModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog as="div" className="fixed z-50 inset-0" open={open} onClose={onClose}>
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative"
            >
              <Dialog.Title className="font-heading text-lg mb-2">Alert Details</Dialog.Title>
              {alert ? (
                <div className="space-y-2 text-midblck">
                  <div className="flex justify-between border-b py-1">
                    <span className="font-semibold">Device</span>
                    <span>{alert.device_name || "-"}</span>
                  </div>
                  <div className="flex justify-between border-b py-1">
                    <span className="font-semibold">Warranty End</span>
                    <span>{alert.warranty_end ? new Date(alert.warranty_end).toLocaleDateString() : "-"}</span>
                  </div>
                  <div className="flex justify-between border-b py-1">
                    <span className="font-semibold">Days Until Expiry</span>
                    <span>{alert.days_until_expiry}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">No alert data.</div>
              )}
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
