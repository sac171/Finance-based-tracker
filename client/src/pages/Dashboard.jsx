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
import AuthModal from "../components/AuthModal";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0);
  const [budget, setBudget] = useState({});
  const [editingExpense, setEditingExpense] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // ✅ User state lives here (lifted from Navbar)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Fetch expenses when logged in
  useEffect(() => {
    if (!user) return;
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch (err) {
        console.log("Error fetching expenses:", err);
      }
    };
    fetchExpenses();
  }, [user]);

  // ✅ If not logged in → show login popup, else add expense
  const handleAddExpense = async (expense) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    try {
      if (editingExpense) {
        const updated = await updateExpense(editingExpense._id, expense);
        setExpenses(expenses.map((e) => (e._id === updated._id ? updated : e)));
        setEditingExpense(null);
      } else {
        const savedExpense = await addExpense(expense);
        setExpenses([...expenses, savedExpense]);
      }
    } catch (err) {
      console.log("Error saving expense:", err);
    }
  };

  // ✅ Delete also requires login
  const handleDeleteExpense = async (id) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
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

      {/* Navbar gets user state + login trigger */}
      <Navbar
        user={user}
        setUser={setUser}
        onLoginClick={() => setShowAuthModal(true)}
      />

      <div className="p-6 max-w-7xl mx-auto w-full">

        <h2 className="text-2xl font-bold mb-2">
          {user ? `Welcome back, ${user.name}! 👋` : "Welcome to 💰 FinTrack"}
        </h2>

        {/* ✅ Guest banner */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-4 py-3 mb-6 flex items-center justify-between flex-wrap gap-2"
          >
            <span>🔒 <strong>Login or Register</strong> to save and track your expenses</span>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition font-medium"
            >
              Login / Register
            </button>
          </motion.div>
        )}

        {/* Income + Budget — visible to all */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <IncomeForm income={income} setIncome={setIncome} />
          <BudgetForm budget={budget} setBudget={setBudget} />
        </div>

        {/* ✅ Expense Form — always visible, login popup triggers on submit if guest */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ExpenseForm
            onAddExpense={handleAddExpense}
            editingExpense={editingExpense}
          />

          {/* Expense list — only if logged in */}
          {user ? (
            <ExpenseList
              expenses={expenses}
              onDelete={handleDeleteExpense}
              onEdit={(expense) => setEditingExpense(expense)}
            />
          ) : (
            <div className="bg-white/60 border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400 mt-4">
              <p className="text-lg">📋 Your expenses will appear here after login</p>
            </div>
          )}
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 mt-6">
          {[
            { title: "Total Expenses", value: user ? `$${totalExpenses}` : "--" },
            { title: "Total Income", value: user ? `$${income}` : "--" },
            {
              title: "Budget Alerts",
              value: user ? insights.filter((i) => i.includes("⚠️")).length : "--",
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
              <p className="text-2xl font-bold mt-2">{card.value}</p>
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
          <Insights insights={user ? insights : []} />
          <SmartTips tips={user ? tips : []} />
        </motion.div>

        {/* Chart */}
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 mt-6">
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          {user ? (
            <CategoryChart expenses={expenses} budgets={budget} />
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 flex-col gap-2">
              <span className="text-4xl">🔒</span>
              <p>Login to see your spending breakdown</p>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* ✅ Global Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          setShowAuthModal(false);
        }}
      />
    </div>
  );
}