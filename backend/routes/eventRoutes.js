import express from "express";
import Booking from "../models/booking.js";
import Event from "../models/event.js";
import User from "../models/user.js";
import Payment from "../models/payment.js";
import Category from "../models/category.js";
import checkRole from "../middleware/checkRole.js";
import validateRequest from "../middleware/validateRequest.js";
import { createEventValidator } from "../validators/eventValidator.js";
import { SQL_QUERIES, rSql } from "../SQLQueries.js";

const router = express.Router();

// GET all events
router.get("/", async (req, res) => {
  try {
    rSql("SELECT_ALL_EVENTS", SQL_QUERIES.SELECT_ALL_EVENTS);

    const events = await Event.findAll({
      include: [
        { model: User, attributes: ["id", "name", "email"], where: { role: "organizer" } },
        { model: Category }
      ],
      attributes: [
        "id",
        "name",
        "description",
        "start_date",
        "end_date",
        "location",
        "price",
        "total_seats",
        "available_seats",
        "created_by"
      ]
    });

    console.log("Query executed successfully. Rows fetched:", events.length);
    res.json(events);
  } catch (err) {
    console.error("SQL Query Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET single event
router.get("/:id", async (req, res) => {
  try {
    rSql("SELECT_EVENT_BY_ID", SQL_QUERIES.SELECT_EVENT_BY_ID, [req.params.id]);

    const event = await Event.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["id", "name", "email"], where: { role: "organizer" } },
        { model: Category }
      ],
      attributes: [
        "id",
        "name",
        "description",
        "start_date",
        "end_date",
        "location",
        "price",
        "total_seats",
        "available_seats"
      ]
    });

    if (!event) {
      console.warn("No event found for ID:", req.params.id);
      return res.status(404).json({ message: "Event not found" });
    }

    console.log("Event fetched successfully:", event.name);
    res.json(event);
  } catch (err) {
    console.error("SQL Query Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// CREATE event (Organizer only)
router.post("/", checkRole("organizer"), createEventValidator, validateRequest, async (req, res) => {
  try {
    const { name, description, start_date, end_date, location, price, category_id, total_seats } = req.body;
    rSql("INSERT_EVENT", SQL_QUERIES.INSERT_EVENT, [name, description, start_date, end_date, location, price, total_seats, total_seats, category_id, req.user.id]);
    const event = await Event.create({
      name,
      description,
      start_date,
      end_date,
      location,
      price,
      total_seats,
      available_seats: total_seats,
      category_id,
      created_by: req.user.id,
    });

    
    res.json({ message: "Event created successfully", event });
  } catch (err) {
    console.error("SQL Query Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// REGISTER for event
router.post("/register", async (req, res) => {
  try {
    const { eventId, userId, no_of_tickets } = req.body;
    rSql("SELECT_EVENT_BY_ID_FOR_UPDATE", SQL_QUERIES.SELECT_EVENT_BY_ID_FOR_UPDATE, [eventId]);
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.available_seats < no_of_tickets) {
      console.warn(" Not enough available seats!");
      return res.status(400).json({ message: "Not enough available seats!" });
    }

    const totalPrice = event.price * no_of_tickets;

    rSql("INSERT_BOOKING", SQL_QUERIES.INSERT_BOOKING, [eventId, userId, no_of_tickets, totalPrice]);
    const booking = await Booking.create({
      event_id: eventId,
      user_id: userId,
      no_of_tickets,
      total_price: totalPrice,
    });

    rSql("INSERT_PAYMENT", SQL_QUERIES.INSERT_PAYMENT, [booking.id, totalPrice, "completed"]);
    await Payment.create({
      booking_id: booking.id,
      amount: totalPrice,
      status: "completed",
    });

    rSql("UPDATE_EVENT_AVAILABLE_SEATS", SQL_QUERIES.UPDATE_EVENT_AVAILABLE_SEATS, [event.available_seats - no_of_tickets, eventId]);
    event.available_seats -= no_of_tickets;
    await event.save();

    console.log(`Booking confirmed. Remaining seats for \'${event.name}\': ${event.available_seats}`);
    res.json({ message: "Successfully registered!", booking, remaining_seats: event.available_seats });
  } catch (err) {
    console.error("SQL Query Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// VIEW bookings (organizer only)
router.get("/:id/bookings", checkRole("organizer"), async (req, res) => {
  try {
    rSql("SELECT_BOOKINGS_FOR_EVENT", SQL_QUERIES.SELECT_BOOKINGS_FOR_EVENT, [req.params.id]);

    const bookings = await Booking.findAll({
      where: { event_id: req.params.id },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });

    console.log("Query executed successfully. Bookings found:", bookings.length);
    res.json(bookings);
  } catch (err) {
    console.error("SQL Query Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET categories
router.get("/categories/list", async (req, res) => {
  try {
    rSql("SELECT_ALL_CATEGORIES", SQL_QUERIES.SELECT_ALL_CATEGORIES);

    const categories = await Category.findAll({ attributes: ["id", "name"] });
    console.log("categories fetched:", categories.length);
    res.json(categories);
  } catch (err) {
    console.error("SQL Query Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
