import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const categories = ["Food", "Travel", "Bills", "Other"];

export default function CategoryChart({ expenses, budgets }) {
  const data = categories.map((cat, index) => {
    const spent = expenses
      ? expenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
      : 0;
    return {
      name: cat,
      value: spent,
      overBudget: budgets && budgets[cat] && spent > budgets[cat],
    };
  });

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
        label={(entry) =>
          entry.overBudget ? `${entry.name} ⚠️` : entry.name
        }
      >
        {data.map((entry, index) => (
          <Cell
            key={index}
            fill={entry.overBudget ? "#FF4C4C" : COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}