import express from "express";
import Payment from "../models/payment.js";
import { verifyOrganizer } from "../middleware/auth.js";

const router = express.Router();

// Update payment status
router.put("/:paymentId", verifyOrganizer, async (req, res) => {
  try {
    console.log("Organizer updating payment:", req.user.id);

    const payment = await Payment.findByPk(req.params.paymentId);
    console.log("Payment found:", payment);

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = req.body.status || payment.status;
    await payment.save();

    res.json({ message: "Payment updated", payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
