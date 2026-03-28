import express from "express";
const router = express.Router();

import {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,

} from "../controllers/expenseController.js";

import { protect } from "../middleware/authMiddleware.js";

router.get("/", protect, getExpenses);
// router.post("/", protect, createExpense);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);






router.post("/", addExpense);
router.get("/", getExpenses);
router.delete("/:id", deleteExpense);
// Update expense
router.put("/:id", updateExpense);

export default router;