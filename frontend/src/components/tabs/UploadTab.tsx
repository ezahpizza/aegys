import FileUploadZone from "@/components/upload/FileUploadZone";
import UploadProgressCard from "@/components/upload/UploadProgressCard";
import { useUploadStore } from "../../stores/uploadStore";
import { useState, useEffect } from "react";

export default function UploadTab({ userId }: { userId: string }) {
  const { uploadResult, uploading, uploadError, reset } = useUploadStore();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (uploading || uploadResult || uploadError) {
      setDialogOpen(true);
    }
  }, [uploading, uploadResult, uploadError]);

  const handleClose = () => {
    setDialogOpen(false);
    if (uploadResult || uploadError) {
      reset();
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      <FileUploadZone userId={userId} />
      <UploadProgressCard
        result={uploadResult}
        loading={uploading}
        error={uploadError}
        onReset={reset}
        open={dialogOpen}
        onClose={handleClose}
      />
    </div>
  );
}