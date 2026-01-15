import axios from "axios";
import type { TimeEntry } from "../types/time-entry";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const createTimeEntry = async (
  timeEntry: Omit<TimeEntry, "id" | "createdAt" | "updatedAt">
): Promise<TimeEntry> => {
  const response = await api.post("/time-entries", timeEntry);
  return response.data;
};
