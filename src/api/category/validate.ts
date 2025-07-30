import { body } from "express-validator";

const validateCategory = [
  body("name")
    .isString()
    .withMessage("Name must be a string.")
    .notEmpty()
    .withMessage("Name is required."),
  body("status")
    .isBoolean()
    .withMessage("Status must be a boolean.")
    .optional(),
];

export default validateCategory;