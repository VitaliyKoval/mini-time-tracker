import React from "react";
import type { TimeEntry } from "../../types/time-entry";

interface TimeEntryListProps {
  entries: TimeEntry[];
}

const TimeEntryList: React.FC<TimeEntryListProps> = ({ entries }) => {
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = new Date(entry.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, TimeEntry[]>);

  const grandTotal = entries.reduce((total, entry) => total + entry.hours, 0);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Entry History</h2>
      {Object.entries(groupedEntries).map(([date, dayEntries]) => {
        const dailyTotal = dayEntries.reduce(
          (total, entry) => total + entry.hours,
          0
        );
        return (
          <div key={date} className="mb-6">
            <div className="flex justify-between items-center mb-2 pb-1 border-b-2">
              <h3 className="text-xl font-bold">
                {new Date(date).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
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
                  className="flex justify-between items-center py-2 px-4 odd:bg-gray-50"
                >
                  <div className="flex-1">
                    <span className="font-semibold">
                      Project {entry.projectId}
                    </span>
                    {entry.description && (
                      <p className="text-sm text-gray-600">
                        {entry.description}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-lg">
                    {entry.hours.toFixed(2)}h
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
