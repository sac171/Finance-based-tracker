import { useState } from "react";

export default function IncomeForm({ income, setIncome }) {
  const [input, setInput] = useState(income || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;
    setIncome(Number(input));
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">Set Total Income</h3>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Enter income"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}