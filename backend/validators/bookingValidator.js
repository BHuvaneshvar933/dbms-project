import { body } from "express-validator";

export const createBookingValidator = [
  body("event_id").isInt({ min: 1 }).withMessage("Valid event ID is required"),
  body("no_of_tickets")
    .isInt({ min: 1 })
    .withMessage("At least one ticket must be booked"),
];
