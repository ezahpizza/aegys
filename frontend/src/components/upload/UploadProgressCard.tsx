import { FileUploadResponse } from "../../types/apiTypes";

interface UploadProgressCardProps {
  result?: FileUploadResponse;
  loading: boolean;
  error?: string;
  onReset: () => void;
}

export default function UploadProgressCard({ result, loading, error, onReset }: UploadProgressCardProps) {
  if (loading) return <div className="bg-midblck/80 rounded-lg p-6 text-center text-lavpink animate-pulse">Uploading...</div>;
  if (error) return (
    <div className="bg-raspink/80 rounded-lg p-6 text-center text-white">
      <div className="mb-2 font-heading">Upload failed</div>
      <div className="mb-2 font-body">{error}</div>
      <button className="mt-2 px-4 py-2 rounded bg-midblck text-lavpink hover:bg-midblu transition" onClick={onReset}>Try Again</button>
    </div>
  );
  if (!result) return null;

  const truncateFilename = (name: string, max = 22) => {
    if (!name) return "";
    return name.length > max ? name.slice(0, max) + "..." : name;
  };
  
  return (
    <div className="bg-midblck/80 rounded-lg p-6 text-center text-lavpink mb-16">
      <div className="mb-2 font-heading">Upload Complete</div>
      <div className="font-body max-w-full overflow-x-auto whitespace-nowrap" title={result.original_filename}>
        {truncateFilename(result.original_filename, 22)} ({(result.file_size / 1024).toFixed(1)} KB)
      </div>
      <div className="mt-2">
        <span className="inline-block px-3 py-1 rounded-full bg-lavpink text-midblck font-body text-xs font-semibold">{result.status}</span>
      </div>
      <button className="mt-4 px-4 py-2 rounded bg-midblck text-lavpink hover:bg-midblu transition" onClick={onReset}>Upload Another</button>
    </div>
  );
}
