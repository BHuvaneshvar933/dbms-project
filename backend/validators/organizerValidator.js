import { body } from "express-validator";

export const registerOrganizerValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("organization_name").notEmpty().withMessage("Organization name is required"),
];