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
    const { eventId, userId, no_of_tickets } = req.body;

    if (!eventId || !userId || !no_of_tickets) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Create booking
    const total_price = event.price * no_of_tickets;
    const booking = await Booking.create({
      event_id: eventId,
      user_id: userId,
      no_of_tickets,
      total_price,
    });

    // Create payment record
    await Payment.create({
      booking_id: booking.id,
      amount: total_price,
      status: "pending",
    });

    res.json({ message: "Booking successful", booking });
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

export default router;
