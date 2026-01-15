import useSWR from "swr";
import { getTimeEntries } from "../../services/api";
import TimeEntryList from "../TimeEntryList";

const EntryHistory = () => {
  const {
    data: entries,
    error,
    isLoading,
  } = useSWR("time-entries", getTimeEntries);

  if (isLoading) {
    return <div className="text-center mt-8">Loading entries...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-500">
        Failed to fetch time entries.
      </div>
    );
  }

  return <TimeEntryList entries={entries || []} />;
};

export default EntryHistory;
