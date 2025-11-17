import express from "express";
import Payment from "../models/payment.js";
import Booking from "../models/booking.js";
import { verifyOrganizer } from "../middleware/auth.js";
import { SQL_QUERIES, rSql } from "../SQLQueries.js";
const router = express.Router();


// Get payment details by ID
router.get("/:paymentId", async (req, res) => {
  try {
    rSql("SELECT_PAYMENT_BY_ID", SQL_QUERIES.SELECT_PAYMENT_BY_ID, [req.params.paymentId]);
    const payment = await Payment.findByPk(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (err) {
    console.error("Error fetching payment:", err);
    res.status(500).json({ error: err.message });
  }
});


// User pays for their booking
router.put("/:paymentId/pay", async (req, res) => {
  try {
    rSql("SELECT_PAYMENT_BY_ID", SQL_QUERIES.SELECT_PAYMENT_BY_ID, [req.params.paymentId]);
    const payment = await Payment.findByPk(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "completed";
    rSql("UPDATE_PAYMENT_STATUS", SQL_QUERIES.UPDATE_PAYMENT_STATUS, ["completed", req.params.paymentId]);
    await payment.save();

    rSql("SELECT_BOOKING_BY_ID", `SELECT * FROM bookings WHERE id = ?`, [payment.booking_id]);
    const booking = await Booking.findByPk(payment.booking_id);
    if (booking) {
      booking.payment_status = "completed";
      rSql("UPDATE_BOOKING_PAYMENT_STATUS", SQL_QUERIES.UPDATE_BOOKING_PAYMENT_STATUS, ["completed", payment.booking_id]);
      await booking.save();
    }

    res.json({ message: "Payment successful", payment });
  } catch (err) {
    console.error("Error processing payment:", err);
    res.status(500).json({ error: err.message });
  }
});


// Organizer manually updates payment status
router.put("/:paymentId", verifyOrganizer, async (req, res) => {
  try {
    rSql("SELECT_PAYMENT_BY_ID", SQL_QUERIES.SELECT_PAYMENT_BY_ID, [req.params.paymentId]);
    const payment = await Payment.findByPk(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = req.body.status || payment.status;
    rSql("UPDATE_PAYMENT_STATUS", SQL_QUERIES.UPDATE_PAYMENT_STATUS, [req.body.status || payment.status, req.params.paymentId]);
    await payment.save();

    res.json({ message: "Payment updated by organizer", payment });
  } catch (err) {
    console.error("Error updating payment by organizer:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
