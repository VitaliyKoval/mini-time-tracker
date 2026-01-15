import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import type { Project } from "../../types/time-entry";
import { createTimeEntry, getTimeEntries } from "../../services/api";

const projects: Project[] = [
  { id: 1, name: "Viso Internal" },
  { id: 2, name: "Client A" },
  { id: 3, name: "Client B" },
  { id: 4, name: "Personal Development" },
];

export const TimeEntryForm = () => {
  const { mutate } = useSWRConfig();
  const { data: entries } = useSWR("time-entries", getTimeEntries);
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(0);
  const [projectId, setProjectId] = useState(projects[0].id);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (hours <= 0) {
      setError("Hours must be a positive number.");
      return;
    }

    if (!description) {
      setError("Description is required.");
      return;
    }

    // Backend expects description, startTime and endTime (ISO strings).
    // Build startTime from the selected date at 09:00 local time and add hours for endTime.
    const start = new Date(`${date}T09:00:00`);
    const end = new Date(start.getTime() + hours * 60 * 60 * 1000);

    // Pre-check: ensure total hours for the selected date won't exceed 24
    if (entries) {
      const selectedDateStr = start.toISOString().slice(0, 10);
      const sumExisting = entries.reduce((acc: number, e) => {
        const s = new Date(e.startTime).toISOString().slice(0, 10);
        if (s !== selectedDateStr) return acc;
        const eh =
          (new Date(e.endTime).getTime() - new Date(e.startTime).getTime()) /
          (1000 * 60 * 60);
        return acc + (Number.isFinite(eh) ? eh : 0);
      }, 0);

      const newHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      if (sumExisting + newHours > 24 + 1e-9) {
        setError("Total hours for the selected date cannot exceed 24 hours.");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const selectedProject = projects.find((p) => p.id === projectId)!;
      await createTimeEntry({
        description,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        projectId: selectedProject.id,
        projectName: selectedProject.name,
      });
      setDescription("");
      setHours(0);
      setProjectId(projects[0].id);
      setDate(new Date().toISOString().slice(0, 10));
      setError(null);
      setSuccess("Time entry saved.");
      setTimeout(() => setSuccess(null), 3000);
      mutate("time-entries");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded-md shadow-sm border"
      aria-live="polite"
    >
      {error && (
        <div className="text-red-700 bg-red-50 border border-red-100 p-2 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-700 bg-green-50 border border-green-100 p-2 rounded">
          {success}
        </div>
      )}
      <div>
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div>
        <label htmlFor="projectId">Project</label>
        <select
          id="projectId"
          value={projectId}
          onChange={(e) => setProjectId(Number(e.target.value))}
          className="w-full p-2 border rounded-md"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="hours">Hours</label>
        <input
          type="number"
          id="hours"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-full p-2 border rounded-md"
          min={0}
          step={0.25}
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows={3}
        />

      </div>
      <button
        type="submit"
        className={`w-full p-2 text-white rounded-md ${
          isSubmitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Submit"}
      </button>
    </form>
  );
};
