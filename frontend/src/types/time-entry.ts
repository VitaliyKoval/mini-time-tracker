export interface TimeEntry {
  id: number;
  date: string;
  projectId: number;
  hours: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type NewTimeEntry = Omit<TimeEntry, "id" | "createdAt" | "updatedAt">;

export interface Project {
  id: number;
  name: string;
}
