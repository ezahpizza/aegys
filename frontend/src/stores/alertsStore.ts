import { create } from "zustand";
import { AlertsResponse, AlertItem, AlertsBySeverity } from "../types/apiTypes";
import { getAlerts, getExpiringAlerts, getAlertsBySeverity } from "../api/alertsApi";

interface AlertsState {
  alerts?: AlertsResponse;
  expiring?: AlertItem[];
  bySeverity?: AlertsBySeverity;
  loading: boolean;
  error?: string;
  selectedSeverity?: string;
  setSelectedSeverity: (severity?: string) => void;
  fetchAlerts: (user_id: string) => Promise<void>;
  fetchExpiring: (user_id: string, days_ahead?: number) => Promise<void>;
  fetchBySeverity: (user_id: string) => Promise<void>;
}

export const useAlertsStore = create<AlertsState>((set) => ({
  loading: false,
  setSelectedSeverity: (severity) => set({ selectedSeverity: severity }),
  fetchAlerts: async (user_id) => {
    set({ loading: true, error: undefined });
    try {
      const alerts = await getAlerts(user_id);
      set({ alerts });
    } catch (e: any) {
      set({ error: e?.response?.data?.detail || e.message });
    } finally {
      set({ loading: false });
    }
  },
  fetchExpiring: async (user_id, days_ahead = 30) => {
    set({ loading: true, error: undefined });
    try {
      const expiring = await getExpiringAlerts(user_id, days_ahead);
      set({ expiring });
    } catch (e: any) {
      set({ error: e?.response?.data?.detail || e.message });
    } finally {
      set({ loading: false });
    }
  },
  fetchBySeverity: async (user_id) => {
    set({ loading: true, error: undefined });
    try {
      const bySeverity = await getAlertsBySeverity(user_id);
      set({ bySeverity });
    } catch (e: any) {
      set({ error: e?.response?.data?.detail || e.message });
    } finally {
      set({ loading: false });
    }
  },
}));