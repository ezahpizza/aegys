import FileUploadZone from "@/components/upload/FileUploadZone";
import UploadProgressCard from "@/components/upload/UploadProgressCard";
import { useUploadStore } from "../../stores/uploadStore";

export default function UploadTab({ userId }: { userId: string }) {
  const { uploadResult, uploading, uploadError, reset } = useUploadStore();

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-8">
      <FileUploadZone userId={userId} />
      <UploadProgressCard
        result={uploadResult}
        loading={uploading}
        error={uploadError}
        onReset={reset}
      />
    </div>
  );
}