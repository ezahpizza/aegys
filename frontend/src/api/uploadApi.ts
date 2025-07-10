import axiosClient from "./axiosClient";
import { FileUploadResponse, FileValidationResponse } from "../types/apiTypes";

export const uploadFile = async (file: File, user_id: string): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", user_id);
  const { data } = await axiosClient.post<FileUploadResponse>("/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const validateFile = async (file: File): Promise<FileValidationResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosClient.post<FileValidationResponse>("/upload/validate", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};