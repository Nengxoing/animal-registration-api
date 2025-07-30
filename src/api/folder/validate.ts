import { body } from "express-validator";

const validatePrices = (prices: any[]) => {
  for (const price of prices) {
    if (typeof price.amount !== "number" || price.amount <= 0) {
      throw new Error("Amount must be a positive number");
    }
    if (typeof price.priceId !== "number" || price.priceId <= 0) {
      throw new Error("PriceId must be a valid number");
    }
  }
};

export const validateCreateFolder = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required"),
  body("billDate")
    .isString()
    .optional(),
  body("folderPrice")
    .optional()
    .isArray()
    .withMessage("Folder price must be an array of prices")
    .custom((prices) => {
      if (prices && prices.length > 0) {
        validatePrices(prices);
      }
      return true;
    }),
];
