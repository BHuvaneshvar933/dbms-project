import express from "express";
import Feedback from "../models/feedback.js";
import Event from "../models/event.js";
import User from "../models/user.js";
import { SQL_QUERIES, rSql } from "../SQLQueries.js";
const router = express.Router();

// Add feedback
router.post("/", async (req, res) => {
  try {
    const { userId, eventId, rating, comment } = req.body;

    if (!userId || !eventId || !rating) {
      return res.status(400).json({ message: "userId, eventId, and rating are required" });
    }

    rSql("SELECT_EVENT_BY_ID", `SELECT id, name FROM events WHERE id = ?`, [eventId]);
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    rSql("SELECT_USER_BY_ID", `SELECT id, name FROM users WHERE id = ?`, [userId]);
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    rSql("INSERT_FEEDBACK", SQL_QUERIES.INSERT_FEEDBACK, [userId, eventId, rating, comment]);
    const feedback = await Feedback.create({ userId, eventId, rating, comment });

    res.json({ message: "Feedback submitted successfully", feedback });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all feedback for an event
router.get("/event/:eventId", async (req, res) => {
  try {
    rSql("SELECT_FEEDBACK_BY_EVENT_ID", SQL_QUERIES.SELECT_FEEDBACK_BY_EVENT_ID, [req.params.eventId]);
    const feedbacks = await Feedback.findAll({
      where: { eventId: req.params.eventId },
      include: [{ model: User, attributes: ["name", "email"] }],
    });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
