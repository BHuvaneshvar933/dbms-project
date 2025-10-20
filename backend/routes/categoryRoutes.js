import express from "express";
import Category from "../models/category.js";
import checkRole from "../middleware/checkRole.js"; 

const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE category (optional: organizer/admin only)
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;