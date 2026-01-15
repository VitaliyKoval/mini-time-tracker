import axios from "axios";
import type { TimeEntry } from "../types/time-entry";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export interface CreateTimeEntryPayload {
  description: string;
  startTime: string; // ISO
  endTime: string; // ISO
  projectId: number;
  projectName: string;
}

export const createTimeEntry = async (
  timeEntry: CreateTimeEntryPayload
): Promise<TimeEntry> => {
  const response = await api.post("/time-entries", timeEntry);
  return response.data;
};

export const getTimeEntries = async (): Promise<TimeEntry[]> => {
  const response = await api.get("/time-entries");
  return response.data;
};
