import { useRef } from "react";
import { useUploadStore } from "../../stores/uploadStore";
import { useToast } from "../ui/use-toast";
import PixelCard from '../ui/PixelCard';
import { Upload } from 'lucide-react';


interface FileUploadZoneProps {
  userId: string;
}

export default function FileUploadZone({ userId }: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, validating, uploading } = useUploadStore();
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    try {
      await upload(file, userId);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err: any) {
      toast({ title: "Upload Error", description: err?.message || "File upload failed", variant: "destructive" });
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (uploading || validating) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className="h-72 border-2 border-dashed border-lavpink rounded-lg p-8 text-center cursor-pointer bg-dot-8-s-2-raspink bg-midblck hover:bg-midblu transition-colors"
      onDrop={onDrop}
      onDragOver={e => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      tabIndex={0}
      role="button"
      aria-label="Upload file"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/*"
        className="hidden"
        onChange={onChange}
        disabled={uploading || validating}
      />

      <div className="h-full flex flex-col items-center justify-center space-y-4">
          <Upload className="h-12 w-12 text-raspink" />
          <PixelCard variant="pink" className='bg-midblu/80 hover:bg-midblck/80'>
          <div className="absolute w-[75%]">
              <div className="font-heading text-lg text-lavpink mb-2">Drag & drop or click to upload</div>
              <div className="text-perspink font-body text-sm">PDF or image files only</div>
          </div>
          </PixelCard>
      </div>
    </div>
  );
}
