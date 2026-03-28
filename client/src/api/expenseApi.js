import axios from "axios";

const BASE_URL = "http://localhost:5000/api/expenses";

// Get all expenses
export const getExpenses = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

// Add new expense
export const addExpense = async (expense) => {
  const res = await axios.post(BASE_URL, expense);
  return res.data;
};

// Delete expense by id
export const deleteExpense = async (id) => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};

// Update expense
export const updateExpense = async (id, updatedExpense) => {
  const res = await axios.put(`${BASE_URL}/${id}`, updatedExpense);
  return res.data;
};  