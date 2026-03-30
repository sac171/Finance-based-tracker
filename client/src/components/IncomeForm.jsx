import { useState } from "react";

export default function IncomeForm({ income, setIncome }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input) return;
    setIncome(Number(input));
    // ✅ FIX: Don't clear the input — user can see their saved value
    // setInput(""); ← this was hiding the saved income
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">💵 Set Total Income</h3>
      {income > 0 && (
        <p className="text-green-600 text-sm mb-2 font-medium">
          ✅ Current income: ${income}
        </p>
      )}
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Enter monthly income"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="p-2 border rounded flex-1 focus:outline-none focus:ring-2 focus:ring-green-400"
          min="0"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Save
        </button>
      </div>
    </form>
  );
}