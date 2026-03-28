export default function ExpenseList({ expenses, onDelete, onEdit }) {
  if (!expenses || expenses.length === 0) return <p>No expenses yet!</p>;

  return (
    <div className="mt-4 space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense._id}
          className="flex justify-between items-center bg-white/80 backdrop-blur-md p-3 rounded-xl shadow border"
        >
          <div>
            <p className="font-semibold">{expense.title}</p>
            <p className="text-sm text-gray-500">
              ${expense.amount} | {expense.category} |{" "}
              {new Date(expense.date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(expense._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
            >
              Delete
            </button>
            <button
              onClick={() => onEdit(expense)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg transition"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}