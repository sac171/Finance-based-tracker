import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// ✅ FIX: Routes were imported but never registered — completely empty router before!
router.post("/signup", signup);
router.post("/login", login);

export default router;