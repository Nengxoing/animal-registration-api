import { body } from "express-validator";

export const validateOffice = [
  body("name").isString().withMessage("Name must be a string.").notEmpty().withMessage("Name is required."),
  body("provinceId").optional().isInt().withMessage("Province ID must be an integer."),
  body("districtId").optional().isInt().withMessage("District ID must be an integer."),
  body("village").isString().withMessage("Village must be a string.").notEmpty().withMessage("Village is required."),
  body("status").optional().isBoolean().withMessage("Status must be a boolean.").default(true),
];
