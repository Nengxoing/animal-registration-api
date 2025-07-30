import { body } from "express-validator";

const validateRefund = [
  body("numberId")
    .isInt()
    .withMessage("number id is required"),
  body("priceId")
    .isInt()
    .withMessage("price id is required"),
  body("profileId")
    .isString()
    .withMessage("profile id is required"),
  body("priceAmount")
    .isString()
    .withMessage("priceAmount is required"),
  body("comment")
    .isString()
    .withMessage("comment is required"),
];

export default validateRefund;
