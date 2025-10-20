import express from "express";
import Booking from "../models/booking.js";
import Event from "../models/event.js";
import User from "../models/user.js";
import Payment from "../models/payment.js";
import Category from "../models/category.js";
import checkRole from "../middleware/checkRole.js";
import validateRequest from "../middleware/validateRequest.js";
import { createEventValidator } from "../validators/eventValidator.js";

const router = express.Router();

// GET all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        { model: User, attributes: ["id", "name", "email"], where: { role: "organizer" } },
        { model: Category }
      ]
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET single event details
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["id", "name", "email"], where: { role: "organizer" } },
        { model: Category }
      ]
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE event — only organizers
router.post(
  "/",
  checkRole("organizer"),
  createEventValidator,
  validateRequest,
  async (req, res) => {
    try {
      const { name, description,  start_date, end_date, location, price, category_id } = req.body;

      const event = await Event.create({
        name,
        description,
        start_date,
        end_date,
        location,
        price,
        category_id,
        created_by: req.user.id, 
      });

      res.json({ message: "Event created successfully", event });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// REGISTER for an event
router.post("/register", async (req, res) => {
  try {
    const { eventId, userId, no_of_tickets } = req.body;

    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const totalPrice = event.price * no_of_tickets;

    const booking = await Booking.create({
      event_id: eventId,
      user_id: userId,
      no_of_tickets: no_of_tickets,
      total_price: totalPrice,
    });

    await Payment.create({
      booking_id: booking.id,
      amount: totalPrice,
      status: "pending",
    });

    res.json({ message: "Successfully registered!", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// VIEW bookings for an event — only organizers
router.get("/:id/bookings", checkRole("organizer"), async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { event_id: req.params.id },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
