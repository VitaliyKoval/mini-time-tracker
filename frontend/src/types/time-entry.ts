export interface TimeEntry {
  id: string;
  description: string;
  startTime: string;
  endTime: string;
  projectId?: number;
  projectName?: string;
  createdAt: string;
  updatedAt: string;
}

export type NewTimeEntry = Omit<TimeEntry, "id" | "createdAt" | "updatedAt">;

export interface Project {
  id: number;
  name: string;
}
