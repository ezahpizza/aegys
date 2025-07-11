import { useState } from "react";
import { parseWarrantyData } from "@/api/llmApi";
import { useFilesStore } from "@/stores/filesStore";

export default function ParseWarrantyButton({ fileId, userId }: { fileId: string, userId: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { fetchFileDetails } = useFilesStore();

  const handleParse = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await parseWarrantyData(fileId, userId);
      setResult(res);
      await fetchFileDetails(fileId, userId);
    } catch (e: any) {
      setError(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-2">
      <button
        className="font-body px-3 py-1 bg-lavpink text-midblck rounded hover:bg-magpink disabled:opacity-50"
        onClick={handleParse}
        disabled={loading}
      >
        {loading ? "Parsing..." : "Parse Warranty Data"}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {result && (
        <div className="mt-2 text-green-700">
          Parsed! Status: {result.status} {result.warranty_data ? "✓" : "No data"}
        </div>
      )}
    </div>
  );
}
