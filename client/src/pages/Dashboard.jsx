import { useState } from "react";
import Navbar from "../components/Navbar";
import CategoryChart from "../components/CategoryChart";
import ExpenseForm from "../components/ExpenseForm";
import Insights from "../components/Insights";
import IncomeForm from "../components/IncomeForm";
import BudgetForm from "../components/BudgetForm";
import { getCategoryInsights } from "../utils/analytics";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0);
  const [budget, setBudget] = useState({});

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const insights = getCategoryInsights(expenses, budget, income);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome to your Dashboard</h2>

        {/* Income & Budget Forms */}
        <IncomeForm income={income} setIncome={setIncome} />
        <BudgetForm budget={budget} setBudget={setBudget} />

        {/* Add Expense Form */}
        <ExpenseForm onAddExpense={handleAddExpense} />

        {/* Insights Section */}
        <Insights insights={insights} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded shadow">Total Expenses: ${totalExpenses}</div>
          <div className="bg-white p-4 rounded shadow">Total Income: ${income}</div>
          <div className="bg-white p-4 rounded shadow">
            Budget Alerts: {insights.filter((i) => i.includes("⚠️")).length}
          </div>
        </div>

        {/* Category Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Category Breakdown</h3>
          <CategoryChart expenses={expenses} />
        </div>
      </div>
    </div>
  );
}