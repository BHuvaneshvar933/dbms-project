import express from "express";
import Feedback from "../models/feedback.js";
import Event from "../models/event.js";
import User from "../models/user.js";

const router = express.Router();

// Add feedback
router.post("/", async (req, res) => {
  try {
    const { userId, eventId, rating, comment } = req.body;

    if (!userId || !eventId || !rating) {
      return res.status(400).json({ message: "userId, eventId, and rating are required" });
    }

    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const feedback = await Feedback.create({ userId, eventId, rating, comment });

    res.json({ message: "Feedback submitted successfully", feedback });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all feedback for an event
router.get("/event/:eventId", async (req, res) => {
  try {
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
