import axiosClient from "./axiosClient";
import {
  FileListResponse,
  FileMetadata,
} from "../types/apiTypes";

export const getFiles = async (
  user_id: string,
  page = 1,
  page_size = 20,
  status?: string
): Promise<FileListResponse> => {
  const params: any = { user_id, page, page_size };
  if (status) params.status = status;
  const { data } = await axiosClient.get<FileListResponse>("/files", { params });
  return data;
};

export const getFileDetails = async (file_id: string, user_id: string): Promise<FileMetadata> => {
  const { data } = await axiosClient.get<FileMetadata>(`/files/${file_id}`, {
    params: { user_id },
  });
  return data;
};

export const deleteFile = async (file_id: string, user_id: string): Promise<any> => {
  const { data } = await axiosClient.delete(`/files/${file_id}`, {
    params: { user_id },
  });
  return data;
};

