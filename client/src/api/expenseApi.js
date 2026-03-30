import axios from "axios";

const BASE_URL = "http://localhost:5000/api/expenses";

// ✅ FIX: Helper to get auth headers — sends JWT token with every request
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all expenses
export const getExpenses = async () => {
  const res = await axios.get(BASE_URL, getAuthHeaders());
  return res.data;
};

// Add new expense
export const addExpense = async (expense) => {
  const res = await axios.post(BASE_URL, expense, getAuthHeaders());
  return res.data;
};

// Delete expense by id
export const deleteExpense = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`, getAuthHeaders());
  return res.data;
};

// Update expense
export const updateExpense = async (id, updatedExpense) => {
  const res = await axios.put(`${BASE_URL}/${id}`, updatedExpense, getAuthHeaders());
  return res.data;
};