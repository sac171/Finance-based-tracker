import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import CategoryChart from "../components/CategoryChart";
import ExpenseForm from "../components/ExpenseForm";
import Insights from "../components/Insights";
import IncomeForm from "../components/IncomeForm";
import BudgetForm from "../components/BudgetForm";
import { getCategoryInsights } from "../utils/analytics";
import SmartTips from "../components/SmartTips";
import { generateSmartTips } from "../utils/aiTips";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
} from "../api/expenseApi";
import ExpenseList from "../components/ExpenseList";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0);
  const [budget, setBudget] = useState({});
  const [editingExpense, setEditingExpense] = useState(null);

  // Fetch expenses from backend on load
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch (err) {
        console.log("Error fetching expenses:", err);
      }
    };
    fetchExpenses();
  }, []);

  // Add or update expense
  const handleAddExpense = async (expense) => {
    try {
      if (editingExpense) {
        // Update existing
        const updated = await updateExpense(editingExpense._id, expense);
        setExpenses(
          expenses.map((e) => (e._id === updated._id ? updated : e))
        );
        setEditingExpense(null);
      } else {
        // Add new
        const savedExpense = await addExpense(expense);
        setExpenses([...expenses, savedExpense]);
      }
    } catch (err) {
      console.log("Error saving expense:", err);
    }
  };

  // Delete expense
  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (err) {
      console.log("Error deleting expense:", err);
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const insights = getCategoryInsights(expenses, budget, income);
  const tips = generateSmartTips(expenses, budget, income);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-6">Welcome to your Dashboard</h2>

        {/* Income + Budget */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <IncomeForm income={income} setIncome={setIncome} />
          <BudgetForm budget={budget} setBudget={setBudget} />
        </div>

        {/* Expense Form + List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ExpenseForm
            onAddExpense={handleAddExpense}
            editingExpense={editingExpense}
          />
          <ExpenseList
            expenses={expenses}
            onDelete={handleDeleteExpense}
            onEdit={(expense) => setEditingExpense(expense)}
          />
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {[
            { title: "Total Expenses", value: totalExpenses },
            { title: "Total Income", value: income },
            {
              title: "Budget Alerts",
              value: insights.filter((i) => i.includes("⚠️")).length,
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-gray-200"
            >
              <h4 className="text-gray-500">{card.title}</h4>
              <p className="text-2xl font-bold mt-2">${card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Insights + Smart Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Insights insights={insights} />
          <SmartTips tips={tips} />
        </motion.div>

        {/* Chart */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 mt-6">
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          <CategoryChart expenses={expenses} />
        </div>
      </div>

      <Footer />
    </div>
  );
}