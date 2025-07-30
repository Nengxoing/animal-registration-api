import { body } from "express-validator";

export const valLogin = [
  body("username").not().isEmpty().withMessage("ກະລຸນາປ້ອນ username").isString().withMessage("ກະລຸນາປ້ອນ username"),
  body("password").not().isEmpty().withMessage("ກະລຸນາປ້ອນ ລະຫັດຜ່ານ"),
];
