import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { FileMetadata } from "../../types/apiTypes";
import ParseWarrantyButton from "../files/ParseWarrantyButton";

interface MetadataCardModalProps {
  open: boolean;
  onClose: () => void;
  file?: FileMetadata;
  loading?: boolean;
}

export default function MetadataCardModal({ open, onClose, file, loading }: MetadataCardModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-midblu border-none text-white rounded-xl shadow-xl p-6">
        <div className="w-full relative">
          <DialogHeader className="font-heading text-lg mb-2">Warranty Metadata</DialogHeader>
          {loading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-magpink" />
            </div>
          )}
          {!loading && file?.warranty_data ? (
            <div className="space-y-2 text-white">
              {Object.entries(file.warranty_data).map(([key, value]) => (
                <div key={key} className="flex justify-between py-1">
                  <span className="font-semibold capitalize">{key.replace(/_/g, " ")}</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="font-body text-center">No metadata available.</div>
          )}
          {file && file._id && file.user_id && (
            <ParseWarrantyButton fileId={file._id} userId={file.user_id} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
