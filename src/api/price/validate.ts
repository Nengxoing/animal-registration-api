import { body } from "express-validator";

const validatePrice = [
  body("name")
    .isString()
    .withMessage("Name must be a string.")
    .notEmpty()
    .withMessage("Name is required."),
  body("price")
    .isDecimal()
    .withMessage("Price must be a decimal number."),
  body("type")
    .isString()
    .withMessage("Type must be either \"YELLOW\" or \"BLUE\"."),
  body("status")
    .isBoolean()
    .withMessage("Status must be a boolean.")
    .optional(),
];

export default validatePrice;

