import { create } from "zustand";
import { FileUploadResponse, FileValidationResponse } from "../types/apiTypes";
import { uploadFile, validateFile } from "../api/uploadApi";
import { useFilesStore } from "./filesStore";

interface UploadState {
  uploading: boolean;
  uploadError?: string;
  uploadResult?: FileUploadResponse;
  validating: boolean;
  validationResult?: FileValidationResponse;
  validationError?: string;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  validate: (file: File) => Promise<void>;
  upload: (file: File, user_id: string) => Promise<void>;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  uploading: false,
  validating: false,
  showModal: false,
  setShowModal: (show) => set({ showModal: show }),
  validate: async (file) => {
    set({ validating: true, validationError: undefined, validationResult: undefined });
    try {
      const result = await validateFile(file);
      set({ validationResult: result });
    } catch (e: any) {
      set({ validationError: e?.response?.data?.error || e.message });
    } finally {
      set({ validating: false });
    }
  },
  upload: async (file, user_id) => {
    set({ uploading: true, uploadError: undefined, uploadResult: undefined, validating: true, validationError: undefined, validationResult: undefined });
    try {
      // validate the file
      const validation = await validateFile(file);
      set({ validationResult: validation, validating: false });
      if (!validation?.valid || validation?.error) {
        set({ uploadError: validation?.error || 'Validation failed', uploading: false });
        return;
      }
      // If validation passes, upload
      const result = await uploadFile(file, user_id);
      set({ uploadResult: result });
      // Refresh files list after successful upload
      const fetchFiles = useFilesStore.getState().fetchFiles;
      if (fetchFiles && user_id) {
        fetchFiles(user_id);
      }
    } catch (e: any) {
      set({ uploadError: e?.response?.data?.detail || e?.response?.data?.error || e.message, validating: false });
    } finally {
      set({ uploading: false, validating: false });
    }
  },
  reset: () =>
    set({
      uploading: false,
      uploadError: undefined,
      uploadResult: undefined,
      validating: false,
      validationResult: undefined,
      validationError: undefined,
    }),
}));