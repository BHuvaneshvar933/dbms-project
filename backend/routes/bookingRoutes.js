import express from "express";
import Booking from "../models/booking.js";
import Event from "../models/event.js";
import User from "../models/user.js";
import Payment from "../models/payment.js";
import { verifyOrganizer } from "../middleware/auth.js";

const router = express.Router();

// User books tickets
router.post("/book", async (req, res) => {
  try {
    const { event_id, user_id, no_of_tickets } = req.body;
    if (!event_id || !user_id || !no_of_tickets)
      return res.status(400).json({ message: "Missing required fields" });

    const event = await Event.findByPk(event_id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const total_price = event.price * no_of_tickets;

    const booking = await Booking.create({
      event_id,
      user_id,
      no_of_tickets,
      total_price,
    });

    const payment = await Payment.create({
      bookingId: booking.id,
      amount: total_price,
      status: "pending",
    });

    res.json({ 
      message: "Booking successful", 
      booking: { ...booking.dataValues, payment } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Organizer sees all bookings for their events
router.get("/event/:eventId", verifyOrganizer, async (req, res) => {
  try {
    console.log("Logged organizer:", req.user.id); 
    const bookings = await Booking.findAll({
      where: { event_id: req.params.eventId },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    console.log("Found bookings:", bookings.length);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET booking by ID (with event and payment details)
router.get("/:bookingId", async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.bookingId, {
      include: [
        { model: Event, attributes: ["id", "name", "price", "location", "start_date", "end_date"] },
        { model: Payment, attributes: ["id", "amount", "status"] }
      ],
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const bookings = await Booking.findAll({
      where: { user_id: userId },
      include: [
        { model: Event, attributes: ["id", "name", "price", "location", "start_date", "end_date"] },
        { model: Payment, attributes: ["id", "amount", "status"] },
      ],
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
