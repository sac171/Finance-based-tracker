import { useState } from "react";

const defaultCategories = ["Food", "Travel", "Bills", "Other"];

export default function BudgetForm({ budget, setBudget }) {
  const [inputBudget, setInputBudget] = useState(budget || {});

  const handleChange = (cat, value) => {
    setInputBudget({ ...inputBudget, [cat]: Number(value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBudget(inputBudget);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-lg font-semibold mb-2">Set Budget per Category</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {defaultCategories.map((cat) => (
          <div key={cat}>
            <label className="block mb-1">{cat}</label>
            <input
              type="number"
              placeholder={`$${cat}`}
              value={inputBudget[cat] || ""}
              onChange={(e) => handleChange(cat, e.target.value)}
              className="p-2 border rounded w-full"
            />
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Save Budget
      </button>
    </form>
  );
}