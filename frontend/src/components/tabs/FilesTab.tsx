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
  
  useEffect(() => {
    if (userId) {
      fetchFiles(userId);
    }
  }, [userId]);

  const [showMeta, setShowMeta] = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);

  const handleMeta = async (file: any) => {
    setMetaLoading(true);
    await fetchFileDetails(file._id, userId);
    setShowMeta(true);
    setMetaLoading(false);
  };


  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = (file: any) => {
    setDeleteTarget(file);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await removeFile(deleteTarget._id, userId);
    setDeleteTarget(null);
    setDeleting(false);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  return (
    <div className="w-full relative">
      <FileTable
        files={files}
        loading={loading}
        error={error}
        onMetaClick={handleMeta}
        onDeleteClick={handleDelete}
        userId={userId}
      />
      <MetadataCardModal open={showMeta} onClose={() => setShowMeta(false)} file={selectedFile} loading={metaLoading} />

      <Dialog open={!!deleteTarget} onOpenChange={cancelDelete}>
        <DialogContent className="bg-midblu/60 border-none text-white">
          <DialogHeader className="font-heading">Delete File</DialogHeader>
          <div className="font-body">Are you sure you want to delete <b>{deleteTarget?.original_filename}</b>?</div>
          <DialogFooter>
            <button
              className="font-body px-4 py-2 bg-magpink text-midblck hover:bg-raspink rounded mr-2"
              onClick={cancelDelete}
              disabled={deleting}
            >Cancel</button>
            <button
              className="font-body px-4 py-2 text-midblck bg-white hover:bg-red-500 hover:text-white rounded"
              onClick={confirmDelete}
              disabled={deleting}
            >{deleting ? 'Deleting...' : 'Delete'}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}