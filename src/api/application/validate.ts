// import { expirationTerm } from "@prisma/client";
import { body } from "express-validator";

export const validatorApplication = [
  body("numberId").isInt().withMessage("Number ID must be an integer"),
  body("profileId").isInt().withMessage("Profile ID must be an integer"),
  body("folderId").isInt().withMessage("Folder ID must be an integer"),
  body("positionId").isInt().withMessage("Position ID must be an integer"),
  body("companyId").isInt().withMessage("Company ID must be an integer"),
  body("registrationDocumentId").optional().custom((value) => value === null || Number.isInteger(value)).withMessage("Registration Document ID must be an integer if provided"),
  body("type").isString().withMessage("Application Type must be a string"),
  body("status").isString().withMessage("Status must be a string"),
  // body("expirationTerm")
  //   .isIn([expirationTerm.SIX_MONTHS, expirationTerm.ONE_YEAR])
  //   .withMessage("Expiration Term must be either SIX_MONTHS or ONE_YEAR"),
  // body("issueDate").isISO8601().withMessage("Issue Date must be a valid date"),
  // body("expirationDate").isISO8601().withMessage("Expiration Date must be a valid date"),
  // body("issueDate").custom((value, { req }) => {
  //   if (new Date(value) >= new Date(req.body.expirationDate)) {
  //     throw new Error("Issue Date must be earlier than Expiration Date");
  //   }
  //   return true;
  // }),
];
