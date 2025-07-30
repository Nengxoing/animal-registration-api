import { body } from "express-validator";

export const validateCountries = [
  body().isArray().withMessage("Expected an array of countries"),
  body("*.name").isString().withMessage("Lao name must be a string"),
  body("*.nationality").isString().withMessage("English name must be a string"),
  body("*.code").isString().withMessage("Code name must be a string"),
  body("*.continent").isString().withMessage("continent name must be a string"),
  body("*.status").optional().isBoolean().withMessage("Status must be a boolean"),
];
