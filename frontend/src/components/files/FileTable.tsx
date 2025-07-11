import StatusBadge from "../ui/StatusBadge";
import { FaDownload, FaCircleInfo } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { getPdfUrl } from "@/api/userApi";
import { AnimatePresence, motion } from "framer-motion";

export default function FileTable({ files, loading, error, onDownloadClick, onMetaClick, onDeleteClick, userId }: any) {
  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-raspink py-8">{error}</div>;
  if (!files?.length) return <div className="text-center py-8">No files found.</div>;

  const truncateFilename = (name: string, max = 18) => {
    if (!name) return "";
    return name.length > max ? name.slice(0, max) + "..." : name;
  };

  return (
    <div className="relative w-full overflow-x-auto">
      <table className="min-w-[400px] w-full bg-midblck/80 rounded-lg shadow overflow-hidden">
        <thead>
          <tr className="text-lavpink font-heading">
            <th className="py-3 px-4 text-left whitespace-nowrap">Name</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Uploaded</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Status</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Expiry</th>
            <th className="py-3 px-4 text-left whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {files.map((file: any) => (
              <motion.tr
                key={file._id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-midblu/40 transition"
              >
                <td className="py-2 px-4 text-lavpink max-w-[140px] truncate" title={file.original_filename}>
                  {truncateFilename(file.original_filename, 18)}
                </td>
                <td className="py-2 px-4 text-lavpink whitespace-nowrap">{new Date(file.uploaded_at).toLocaleDateString()}</td>
                <td className="py-2 px-4 text-lavpink whitespace-nowrap">
                  <StatusBadge status={file.status} />
                </td>
                <td className="py-2 px-4 text-lavpink whitespace-nowrap">
                  {file.expires_at ? new Date(file.expires_at).toLocaleDateString() : "-"}
                </td>
                <td className="py-2 px-4 text-lavpink whitespace-nowrap">
                  <div className="flex gap-2">
                    <a
                      className="text-lavpink hover:text-magpink"
                      href={getPdfUrl({ ...file, user_id: userId })}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      aria-label="Download file"
                      title="Download file"
                      onClick={e => { e.stopPropagation(); onDownloadClick && onDownloadClick(file); }}
                    >
                      <FaDownload className="h-5 w-5"/>
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
                      <FaCircleInfo className="h-5 w-5"/>
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
                      <MdDeleteForever className="h-6 w-6"/>
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
