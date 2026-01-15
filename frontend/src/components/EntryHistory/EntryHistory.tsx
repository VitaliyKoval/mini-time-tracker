import React, { useEffect, useState } from "react";
import { getTimeEntries } from "../../services/api";
import type { TimeEntry } from "../../types/time-entry";
import TimeEntryList from "../TimeEntryList";

const EntryHistory: React.FC = () => {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const timeEntries = await getTimeEntries();
        setEntries(timeEntries);
        setError(null);
      } catch (err) {
        setError("Failed to fetch time entries.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading entries...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return <TimeEntryList entries={entries} />;
};

export default EntryHistory;
