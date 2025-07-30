/* eslint-disable no-magic-numbers */
import { body } from "express-validator";

const baseUserSchema = [
  body("firstName").not().isEmpty().withMessage("ກະລຸນາປ້ອນ ຊື່").isString().withMessage("ກະລຸນາປ້ອນ ຊື່ ຄືກັນ"),
  body("lastName").not().isEmpty().withMessage("ກະລຸນາປ້ອນ ນາມສະກຸນ").isString().withMessage("ກະລຸນາປ້ອນ ນາມສະກຸນ"),
  body("username").not().isEmpty().withMessage("ກະລຸນາປ້ອນ username").isString().withMessage("ກະລຸນາປ້ອນ username"),
  body("phone").not().isEmpty().withMessage("ກະລຸນາປ້ອນ ໝາຍເລກໂທລະສັບ").isLength({ min: 8, max: 8 }).withMessage("ກະລຸນາປ້ອນ ໝາຍເລກໂທລະສັບ 8 ເທົ່ານັ້ນ"),
  body("role").not().isEmpty().withMessage("ກະລຸນາປ້ອນ ຕຳແໜ່ງ").isIn(["ADMIN", "FINANCE", "POLICE_OFFICER", "POLICE_COMMANDER", "FARMER", "POLICE_PRODUCTION", "VERSIFICATION_OFFICER"]).withMessage("ກະລຸນາປ້ອນ ຕຳແໜ່ງ ທີ່ຖືກຕ້ອງ"),
  body("email").not().isEmpty().withMessage("ກະລຸນາປ້ອນ ອີເມວ").isEmail().withMessage("ກະລຸນາປ້ອນ ອີເມວທີ່ຖືກຕ້ອງ"),
  body("officeId").optional().isInt().withMessage("ກະລຸນາປ້ອນ ລະຫັດສາຂາ (ຖ້າມີ)"),
  body("isActive").optional().isBoolean().withMessage("ກະລຸນາປ້ອນ ສະຖານະ"),
];

const validatePassword = (value: string) => {
  if (value) {
    if (value.length < 8) {
      throw new Error("ລະຫັດຜ່ານຕ້ອງມີຢ່າງນ້ອຍ 8 ຕົວອັກສອນ");
    }
    if (!/[a-z]/.test(value)) {
      throw new Error("ລະຫັດຜ່ານຕ້ອງມີຢ່າງນ້ອຍ 1 ຕົວອັກສອນຂຽນນ້ອຍ");
    }
    if (!/[A-Z]/.test(value)) {
      throw new Error("ລະຫັດຜ່ານຕ້ອງມີຢ່າງນ້ອຍ 1 ຕົວອັກສອນຂຽນໃຫຍ່");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      throw new Error("ລະຫັດຜ່ານຕ້ອງມີຢ່າງນ້ອຍ 1 ສຽງສັນ");
    }
    if (!/\d/.test(value)) {
      throw new Error("ລະຫັດຜ່ານຕ້ອງມີຢ່າງນ້ອຍ 1 ຕົວເລກ");
    }
  }
  return true;
};

export const userSchemaCreate = [
  ...baseUserSchema,
  body("password").custom(validatePassword),
];

export const userSchemaUpdate = [
  ...baseUserSchema,
  body("password").optional().custom(validatePassword),
];