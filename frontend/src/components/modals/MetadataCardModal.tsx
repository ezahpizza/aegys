import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FileMetadata } from "../../types/apiTypes";
import ParseWarrantyButton from "../files/ParseWarrantyButton";

interface MetadataCardModalProps {
  open: boolean;
  onClose: () => void;
  file?: FileMetadata;
}

export default function MetadataCardModal({ open, onClose, file }: MetadataCardModalProps) {
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
              className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative"
            >
              <Dialog.Title className="font-heading text-lg mb-2">Warranty Metadata</Dialog.Title>
              {file?.warranty_data ? (
                <div className="space-y-2 text-midblck">
                  {Object.entries(file.warranty_data).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b py-1">
                      <span className="font-semibold capitalize">{key.replace(/_/g, " ")}</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">No metadata available.</div>
              )}
              {file && file._id && file.user_id && (
                <ParseWarrantyButton fileId={file._id} userId={file.user_id} />
              )}
              <button
                className="absolute top-4 right-4 text-midblck hover:text-magpink text-2xl"
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
