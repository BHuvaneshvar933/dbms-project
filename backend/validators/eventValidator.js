import { body } from "express-validator";

export const createEventValidator = [
  body("name").notEmpty().withMessage("Event name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("start_date")
    .isISO8601()
    .withMessage("Valid start date is required"),
  
  body("end_date")
    .isISO8601()
    .withMessage("Valid end date is required"),
  body("location").notEmpty().withMessage("location is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
  body("category_id")
    .isInt({ min: 1 })
    .withMessage("Valid category ID is required"),
];
