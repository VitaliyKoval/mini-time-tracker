import { TimeEntryForm } from "./components/TimeEntryForm";

function App() {
  return (
    <div className="container mx-auto p-4 max-w-[800px]">
      <h1 className="text-2xl font-bold mb-4 text-center">Time Tracker</h1>
      <TimeEntryForm />
    </div>
  );
}

export default App;
