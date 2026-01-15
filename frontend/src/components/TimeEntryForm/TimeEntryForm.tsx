import { useState } from "react";
import type { NewTimeEntry, Project } from "../../types/time-entry";
import { createTimeEntry } from "../../services/api";

const projects: Project[] = [
  { id: 1, name: "Viso Internal" },
  { id: 2, name: "Client A" },
  { id: 3, name: "Client B" },
  { id: 4, name: "Personal Development" },
];

export const TimeEntryForm = () => {
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(0);
  const [projectId, setProjectId] = useState(projects[0].id);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

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

    const newTimeEntry: NewTimeEntry = {
      date,
      projectId,
      hours,
      description,
    };

    try {
      await createTimeEntry(newTimeEntry);
      setDescription("");
      setHours(0);
      setProjectId(projects[0].id);
      setDate(new Date().toISOString().slice(0, 10));
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
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
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded-md"
      >
        Submit
      </button>
    </form>
  );
};
