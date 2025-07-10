import { create } from "zustand";
import {
  FileMetadata,
  FileStatsResponse,
  ExpiringFileResponse,
} from "../types/apiTypes";

import {
  getFiles,
  getFileDetails,
  deleteFile,
} from "../api/filesApi";

import {
  getFileStats,
  getExpiringWarranties,
} from "../api/userApi";

interface FilesState {
  files: FileMetadata[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error?: string;
  selectedFile?: FileMetadata;
  stats?: FileStatsResponse;
  expiring?: ExpiringFileResponse;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  fetchFiles: (user_id: string, page?: number, pageSize?: number, status?: string) => Promise<void>;
  fetchFileDetails: (file_id: string, user_id: string) => Promise<void>;
  removeFile: (file_id: string, user_id: string) => Promise<void>;
  fetchStats: (user_id: string) => Promise<void>;
  fetchExpiring: (user_id: string, days_ahead?: number) => Promise<void>;
  clearSelected: () => void;
}

export const useFilesStore = create<FilesState>((set, get) => ({
  files: [],
  total: 0,
  page: 1,
  pageSize: 20,
  totalPages: 0,
  loading: false,
  modalOpen: false,
  setModalOpen: (open) => set({ modalOpen: open }),
  fetchFiles: async (user_id, page = 1, pageSize = 20, status) => {
    set({ loading: true, error: undefined });
    try {
      const res = await getFiles(user_id, page, pageSize, status);
      set({
        files: res.files,
        total: res.total,
        page: res.page,
        pageSize: res.page_size,
        totalPages: res.total_pages,
      });
    } catch (e: any) {
      set({ error: e?.response?.data?.detail || e.message });
    } finally {
      set({ loading: false });
    }
  },
  fetchFileDetails: async (file_id, user_id) => {
    set({ loading: true, error: undefined });
    try {
      const file = await getFileDetails(file_id, user_id);
      set({ selectedFile: file });
    } catch (e: any) {
      set({ error: e?.response?.data?.detail || e.message });
    } finally {
      set({ loading: false });
    }
  },
  removeFile: async (file_id, user_id) => {
    set({ loading: true, error: undefined });
    try {
      await deleteFile(file_id, user_id);
      // Remove from local state
      set((state) => ({
        files: state.files.filter((f) => f._id !== file_id),
        selectedFile: state.selectedFile?._id === file_id ? undefined : state.selectedFile,
      }));
    } catch (e: any) {
      set({ error: e?.response?.data?.detail || e.message });
    } finally {
      set({ loading: false });
    }
  },
  fetchStats: async (user_id) => {
    set({ loading: true, error: undefined });
    try {
      const stats = await getFileStats(user_id);
      set({ stats });
    } catch (e: any) {
      set({ error: e?.response?.data?.detail || e.message });
    } finally {
      set({ loading: false });
    }
  },
  fetchExpiring: async (user_id, days_ahead = 30) => {
    set({ loading: true, error: undefined });
    try {
      const expiring = await getExpiringWarranties(user_id, days_ahead);
      set({ expiring });
    } catch (e: any) {
      set({ error: e?.response?.data?.detail || e.message });
    } finally {
      set({ loading: false });
    }
  },
  clearSelected: () => set({ selectedFile: undefined }),
}));