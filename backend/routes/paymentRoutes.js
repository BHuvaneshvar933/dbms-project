import express from "express";
import Payment from "../models/payment.js";
import Booking from "../models/booking.js";
import { verifyOrganizer } from "../middleware/auth.js";

const router = express.Router();


// Get payment details by ID
router.get("/:paymentId", async (req, res) => {
  try {
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
    const payment = await Payment.findByPk(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "completed";
    await payment.save();

    const booking = await Booking.findByPk(payment.booking_id);
    if (booking) {
      booking.payment_status = "completed";
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
    const payment = await Payment.findByPk(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = req.body.status || payment.status;
    await payment.save();

    res.json({ message: "Payment updated by organizer", payment });
  } catch (err) {
    console.error("Error updating payment by organizer:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
