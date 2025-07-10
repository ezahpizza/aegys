import axiosClient from "./axiosClient";
import { LLMParseResponse } from "../types/apiTypes";

export const parseWarrantyData = async (
  file_id: string,
  user_id: string
): Promise<LLMParseResponse> => {
  const { data } = await axiosClient.post<LLMParseResponse>(
    "/llm/parse",
    { file_id },
    { params: { user_id } }
  );
  return data;
};