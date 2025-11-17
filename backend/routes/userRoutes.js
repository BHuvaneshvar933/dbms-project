import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import validateRequest from "../middleware/validateRequest.js";
import { registerUserValidator, loginUserValidator } from "../validators/userValidator.js";
import { SQL_QUERIES, rSql } from "../SQLQueries.js";


const router = express.Router();

// User registration
// POST /users/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    rSql("SELECT_USER_BY_EMAIL", SQL_QUERIES.SELECT_USER_BY_EMAIL, [email]);
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    rSql("INSERT_USER", SQL_QUERIES.INSERT_USER, [name, email, hashedPassword, role || "user", null]);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", 
    });

    res.json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST /users/register-organizer
router.post("/register-organizer", async (req, res) => {
  try {
    const { name, email, password, organization_name } = req.body;

    rSql("SELECT_USER_BY_EMAIL", SQL_QUERIES.SELECT_USER_BY_EMAIL, [email]);
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    rSql("INSERT_USER", SQL_QUERIES.INSERT_USER, [name, email, hashedPassword, "organizer", organization_name]);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "organizer", 
      organization_name,  
    });

    res.json({ message: "Organizer registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// User login
// POST /users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    rSql("SELECT_USER_BY_EMAIL", SQL_QUERIES.SELECT_USER_BY_EMAIL, [email]);
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, user,role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
