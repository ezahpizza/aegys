import StatusBadge from "../ui/StatusBadge";

import { getPdfUrl } from "@/api/userApi";

export default function FileTable({ files, loading, error, onDownloadClick, onMetaClick, onDeleteClick, userId }: any) {
  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-raspink py-8">{error}</div>;
  if (!files?.length) return <div className="text-center py-8">No files found.</div>;

  return (
    <table className="w-full bg-midblck/80 rounded-lg shadow overflow-hidden">
      <thead>
        <tr className="text-lavpink font-heading">
          <th className="py-3 px-4 text-left">Name</th>
          <th className="py-3 px-4">Uploaded</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Expiry</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file: any) => (
          <tr key={file._id} className="hover:bg-midblu/40 transition">
            <td className="py-2 px-4">{file.original_filename}</td>
            <td className="py-2 px-4">{new Date(file.uploaded_at).toLocaleDateString()}</td>
            <td className="py-2 px-4">
              <StatusBadge status={file.status} />
            </td>
            <td className="py-2 px-4">
              {file.expires_at ? new Date(file.expires_at).toLocaleDateString() : "-"}
            </td>
            <td className="py-2 px-4 flex gap-2">
              <a
                className="text-lavpink hover:text-magpink"
                href={getPdfUrl({ ...file, user_id: userId })}
                target="_blank"
                rel="noopener noreferrer"
                download
                aria-label="Download file"
                title="Download file"
                onClick={e => { e.stopPropagation(); onDownloadClick(file); }}
              >
                <span role="img" aria-label="download">⬇️</span>
              </a>
              <button
                className="text-lavpink hover:text-magpink"
                onClick={(e) => {
                  e.stopPropagation();
                  onMetaClick(file);
                }}
                aria-label="View metadata"
                title="View metadata"
              >
                <span role="img" aria-label="metadata">🛈</span>
              </button>
              <button
                className="text-lavpink hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(file);
                }}
                aria-label="Delete file"
                title="Delete file"
              >
                <span role="img" aria-label="delete">🗑️</span>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}