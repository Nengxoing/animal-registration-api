import { body } from "express-validator";

export const validateCreateFolder = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),
  body("totalApplications")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Total applications must be a non-negative integer"),
  body("approvedApplications")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Approved applications must be a non-negative integer"),
];
