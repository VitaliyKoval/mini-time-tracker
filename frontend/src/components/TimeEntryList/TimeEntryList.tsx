import React from "react";
import type { TimeEntry } from "../../types/time-entry";

interface TimeEntryListProps {
  entries: TimeEntry[];
}

const TimeEntryList: React.FC<TimeEntryListProps> = ({ entries }) => {
  const groupedEntries = entries.reduce((acc, entry) => {
    // entries from backend provide startTime/endTime; compute date from startTime
    const date = entry.startTime
      ? new Date(entry.startTime).toDateString()
      : new Date().toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, TimeEntry[]>);

  // ensure dates are sorted descending
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const getEntryHours = (entry: TimeEntry) => {
    if (entry.startTime && entry.endTime) {
      const start = new Date(entry.startTime).getTime();
      const end = new Date(entry.endTime).getTime();
      const hours = (end - start) / (1000 * 60 * 60);
      return Number.isFinite(hours) ? hours : 0;
    }
    return 0;
  };

  const grandTotal = entries.reduce(
    (total, entry) => total + getEntryHours(entry),
    0
  );

  if (!entries || entries.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-600">
        <h2 className="text-2xl font-bold mb-2">Entry History</h2>
        <p className="mb-4">No time entries yet. Use the form above to add your first entry.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Entry History</h2>
      {sortedDates.map((date) => {
        const dayEntries = groupedEntries[date];
        const dailyTotal = dayEntries.reduce(
          (total, entry) => total + getEntryHours(entry),
          0
        );
        return (
          <div key={date} className="mb-6">
            <div className="flex justify-between items-center mb-2 pb-1 border-b-2">
              <h3 className="text-xl font-bold">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </h3>
              <div className="text-right">
                <span className="font-bold text-lg">
                  {dailyTotal.toFixed(2)}
                </span>
                <span className="text-sm text-gray-600"> hours</span>
              </div>
            </div>
            <ul>
              {dayEntries.map((entry) => (
                <li
                  key={entry.id}
                  className="flex justify-between items-center py-2 px-4 odd:bg-gray-50 hover:bg-gray-100 rounded"
                >
                  <div className="flex-1">
                    <span className="font-semibold">
                      {entry.projectName
                        ? entry.projectName
                        : entry.projectId
                        ? `Project ${entry.projectId}`
                        : "Project"}
                    </span>
                    {entry.description && (
                      <p className="text-sm text-gray-600">
                        {entry.description}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-lg">
                    {getEntryHours(entry).toFixed(2)}h
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <div className="flex justify-end items-center mt-4 pt-2 border-t-2">
        <span className="text-xl font-bold mr-2">Grand Total:</span>
        <span className="font-bold text-2xl">{grandTotal.toFixed(2)}</span>
        <span className="text-lg text-gray-600 ml-1"> hours</span>
      </div>
    </div>
  );
};

export default TimeEntryList;
