import express from "express";
import Booking from "../models/booking.js";
import Event from "../models/event.js";
import User from "../models/user.js";
import Payment from "../models/payment.js";
import { verifyOrganizer } from "../middleware/auth.js";
import { SQL_QUERIES, rSql } from "../SQLQueries.js";
const router = express.Router();

  //USER BOOKS TICKETS
router.post("/book", async (req, res) => {
  try {
    const { event_id, user_id, no_of_tickets } = req.body;

    if (!event_id || !user_id || !no_of_tickets) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    rSql("SELECT_EVENT_BY_ID_FOR_UPDATE", SQL_QUERIES.SELECT_EVENT_BY_ID_FOR_UPDATE, [event_id]);
    const event = await Event.findByPk(event_id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.available_seats < no_of_tickets) {
      return res.status(400).json({
        message: `Only ${event.available_seats} seats available for this event.`,
      });
    }

    const total_price = event.price * no_of_tickets;

    rSql("INSERT_BOOKING", SQL_QUERIES.INSERT_BOOKING, [event_id, user_id, no_of_tickets, total_price]);
    const booking = await Booking.create({
      event_id,
      user_id,
      no_of_tickets,
      total_price,
    });

    rSql("INSERT_PAYMENT", SQL_QUERIES.INSERT_PAYMENT, [booking.id, total_price, "pending"]);
    const payment = await Payment.create({
      bookingId: booking.id,
      amount: total_price,
      status: "pending",
    });

    rSql("UPDATE_EVENT_AVAILABLE_SEATS", SQL_QUERIES.UPDATE_EVENT_AVAILABLE_SEATS, [event.available_seats - no_of_tickets, event_id]);
    event.available_seats -= no_of_tickets;
    await event.save();

    res.status(201).json({
      message: "Booking successful!",
      booking: { ...booking.dataValues, payment },
    });
  } catch (err) {
    console.error("Error during booking:", err);
    res.status(500).json({ error: err.message });
  }
});


  // ORGANIZER SEES BOOKINGS FOR AN EVENT
router.get("/event/:eventId", verifyOrganizer, async (req, res) => {
  try {
    rSql("SELECT_BOOKINGS_FOR_EVENT", SQL_QUERIES.SELECT_BOOKINGS_FOR_EVENT, [req.params.eventId]);
    const bookings = await Booking.findAll({
      where: { event_id: req.params.eventId },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    if (!bookings || bookings.length === 0) {
      return res.json([]);
    }

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: err.message });
  }
});


  //  GET BOOKING BY ID (WITH EVENT & PAYMENT DETAILS)
router.get("/:bookingId", async (req, res) => {
  try {
    rSql("SELECT_BOOKING_BY_ID_WITH_DETAILS", `SELECT b.*, e.name AS event_name, p.amount AS payment_amount FROM bookings b JOIN events e ON b.event_id = e.id LEFT JOIN payments p ON b.id = p.booking_id WHERE b.id = ?`, [req.params.bookingId]);
    const booking = await Booking.findByPk(req.params.bookingId, {
      include: [
        {
          model: Event,
          attributes: ["id", "name", "price", "location", "start_date", "end_date"],
        },
        {
          model: Payment,
          attributes: ["id", "amount", "status"],
        },
      ],
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    res.json(booking);
  } catch (err) {
    console.error("Error fetching booking by ID:", err);
    res.status(500).json({ error: err.message });
  }
});

//  GET ALL BOOKINGS FOR A USER
router.get("/user/:userId", async (req, res) => {
  try {
    rSql("SELECT_ALL_BOOKINGS_FOR_USER", `SELECT b.*, e.name AS event_name, p.amount AS payment_amount FROM bookings b JOIN events e ON b.event_id = e.id LEFT JOIN payments p ON b.id = p.booking_id WHERE b.user_id = ?`, [req.params.userId]);
    const bookings = await Booking.findAll({
      where: { user_id: req.params.userId },
      include: [
        {
          model: Event,
          attributes: ["id", "name", "price", "location", "start_date", "end_date"],
        },
        {
          model: Payment,
          attributes: ["id", "amount", "status"],
        },
      ],
    });

    res.json(bookings);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
