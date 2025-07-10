import { useEffect, useState } from "react";
import { useFilesStore } from "../../stores/filesStore";
import FileTable from "@/components/files/FileTable";
import MetadataCardModal from "@/components/modals/MetadataCardModal";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";


export default function FilesTab({ userId }: { userId: string }) {
  const {
    files,
    loading,
    error,
    selectedFile,
    fetchFiles,
    fetchFileDetails,
    removeFile,
  } = useFilesStore();
  
  // Fetch files on mount or when userId changes
  useEffect(() => {
    if (userId) fetchFiles(userId);
  }, [userId]);

  // Modal state for metadata only
  const [showMeta, setShowMeta] = useState(false);

  // Handler for metadata button
  const handleMeta = async (file: any) => {
    await fetchFileDetails(file._id, userId);
    setShowMeta(true);
  };


  // State for delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  // Handler for delete button (open dialog)
  const handleDelete = (file: any) => {
    setDeleteTarget(file);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await removeFile(deleteTarget._id, userId);
    setDeleteTarget(null);
    setDeleting(false);
    // Instead of full refetch, optimistically update files in store
    // Optionally, you can call fetchFiles(userId) if needed
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  return (
    <div className="w-full relative">
      {/* Overlay for loading during delete or fetch */}
      {(loading || deleting) && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-magpink" />
        </div>
      )}
      <FileTable
        files={files}
        loading={loading}
        error={error}
        onMetaClick={handleMeta}
        onDeleteClick={handleDelete}
        userId={userId}
      />
      <MetadataCardModal open={showMeta} onClose={() => setShowMeta(false)} file={selectedFile} />

      {/* Custom Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={cancelDelete}>
        <DialogContent>
          <DialogHeader>Delete File</DialogHeader>
          <div>Are you sure you want to delete <b>{deleteTarget?.original_filename}</b>?</div>
          <DialogFooter>
            <button
              className="px-4 py-2 bg-gray-200 rounded mr-2"
              onClick={cancelDelete}
              disabled={deleting}
            >Cancel</button>
            <button
              className="px-4 py-2 bg-magpink text-white rounded"
              onClick={confirmDelete}
              disabled={deleting}
            >{deleting ? 'Deleting...' : 'Delete'}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}