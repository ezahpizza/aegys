import axiosClient from "./axiosClient";
import {
  FileMetadata,
  FileStatsResponse,
  ExpiringFileResponse,
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

export function getPdfUrl(file?: FileMetadata): string {
  if (!file || !file.user_id || !file._id) return '';
  return `/user/view/${file._id}?user_id=${encodeURIComponent(file.user_id)}`;
}