import axiosClient from "./axiosClient";

import {
  FileMetadata,
  FileStatsResponse,
  ExpiringFileResponse,
  CleanupResponse,
} from "../types/apiTypes";

export const getFileStats = async (user_id: string): Promise<FileStatsResponse> => {
  const { data } = await axiosClient.get<FileStatsResponse>(`/user/${user_id}/stats`);
  return data;
};

export const getExpiringWarranties = async (
  user_id: string,
  days_ahead = 30
): Promise<ExpiringFileResponse> => {
  const { data } = await axiosClient.get<ExpiringFileResponse>(
    `/user/${user_id}/expiring`,
    { params: { days_ahead } }
  );
  return data;
};

export const cleanupUserFiles = async (
  user_id: string,
  dry_run: boolean = false
): Promise<CleanupResponse> => {
  const { data } = await axiosClient.post<CleanupResponse>(
    `/user/${user_id}/cleanup`,
    {},
    { params: { dry_run } }
  );
  return data;
};

export function getPdfUrl(file?: FileMetadata): string {
  if (!file || !file.user_id || !file._id) return '';
  return `/user/view/${file._id}?user_id=${encodeURIComponent(file.user_id)}`;
}
