import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { FileUploadResponse } from "../../types/apiTypes";

interface UploadProgressCardProps {
  result?: FileUploadResponse;
  loading: boolean;
  error?: string;
  onReset: () => void;
  open: boolean;
  onClose: () => void;
}

export default function UploadProgressCard({ result, loading, error, onReset, open, onClose }: UploadProgressCardProps) {
  const truncateFilename = (name: string, max = 22) => {
    if (!name) return "";
    return name.length > max ? name.slice(0, max) + "..." : name;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-midblu border-none text-white rounded-xl shadow-xl p-6">
        <div className="w-full relative">
          <DialogHeader className="font-heading text-lg mb-2">Upload Status</DialogHeader>
          {loading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-magpink" />
            </div>
          )}
          {!loading && error && (
            <div className="bg-raspink/80 rounded-lg p-6 text-center text-white">
              <div className="mb-2 font-heading">Upload failed</div>
              <div className="mb-2 font-body">{error}</div>
              <button className="mt-2 px-4 py-2 rounded bg-midblck text-lavpink hover:bg-midblu transition" onClick={onReset}>Try Again</button>
            </div>
          )}
          {!loading && !error && result && (
            <div className="space-y-2 text-white text-center">
              <div className="mb-2 font-heading">Upload Complete</div>
              <div className="font-body max-w-full overflow-x-auto whitespace-nowrap" title={result.original_filename}>
                {truncateFilename(result.original_filename, 22)} ({(result.file_size / 1024).toFixed(1)} KB)
              </div>
              <div className="mt-2">
                <span className="inline-block px-3 py-1 rounded-full bg-lavpink text-midblck font-body text-xs font-semibold">{result.status}</span>
              </div>
              <button className="mt-4 px-4 py-2 rounded bg-midblck text-lavpink hover:bg-midblu transition" onClick={onReset}>Upload Another</button>
            </div>
          )}
          {!loading && !error && !result && (
            <div className="font-body text-center">No upload result available.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
