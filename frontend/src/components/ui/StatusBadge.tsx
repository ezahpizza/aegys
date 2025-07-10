// src/components/ui/StatusBadge.tsx
import clsx from "clsx";

const statusMap: Record<string, { color: string; label: string }> = {
  uploaded: { color: "bg-perspink text-midblck", label: "Uploaded" },
  processing: { color: "bg-midblu text-lavpink", label: "Processing" },
  processed: { color: "bg-lavpink text-midblck", label: "Processed" },
  "": { color: "bg-lavpink text-midblck", label: "Text Extracted" },
  failed: { color: "bg-raspink text-white", label: "Failed" },
  deleted: { color: "bg-midblck text-lavpink", label: "Deleted" },
  expired: { color: "bg-raspink text-white", label: "Expired" },
  critical: { color: "bg-magpink text-white", label: "Critical" },
  warning: { color: "bg-perspink text-midblck", label: "Warning" },
  notice: { color: "bg-lavpink text-midblck", label: "Notice" },
  normal: { color: "bg-midblu text-lavpink", label: "Normal" },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = statusMap[status] || statusMap["normal"];
  return (
    <span
      className={clsx(
        "inline-block px-3 py-1 rounded-full font-body text-xs font-semibold transition-colors",
        s.color
      )}
      aria-label={s.label}
    >
      {s.label}
    </span>
  );
}