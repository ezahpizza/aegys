import axiosClient from "./axiosClient";
import { AlertsResponse, AlertItem, AlertsBySeverity } from "../types/apiTypes";

export const getAlerts = async (user_id: string): Promise<AlertsResponse> => {
  const { data } = await axiosClient.get<AlertsResponse>("/cleanup/alerts", {
    headers: { "user_id": user_id },
  });
  return data;
};

export const getExpiringAlerts = async (
  user_id: string,
  days_ahead = 30
): Promise<AlertItem[]> => {
  const { data } = await axiosClient.get<AlertItem[]>("/cleanup/alerts/expiring", {
    headers: { "user_id": user_id },
    params: { days_ahead },
  });
  return data;
};

export const getAlertsBySeverity = async (user_id: string): Promise<AlertsBySeverity> => {
  const { data } = await axiosClient.get<AlertsBySeverity>("/cleanup/alerts/severity", {
    headers: { "user_id": user_id },
  });
  return data;
};