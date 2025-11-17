import express from "express";
import Category from "../models/category.js";
import checkRole from "../middleware/checkRole.js"; 
import { SQL_QUERIES, rSql } from "../SQLQueries.js";
const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    rSql("SELECT_ALL_CATEGORIES", SQL_QUERIES.SELECT_ALL_CATEGORIES);
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE category 
router.post("/", async (req, res) => {
  try {
    rSql("INSERT_CATEGORY", SQL_QUERIES.INSERT_CATEGORY, [req.body.name]);
    const { name } = req.body;
    const category = await Category.create({ name });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;