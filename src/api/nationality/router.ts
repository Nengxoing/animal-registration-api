import Router from "express";

import { valResult } from "../../utils/validateResult";

import { authenticate } from "../../utils/jwt";
import {
  aggregationController,
  createNationalitysController,
  ediNationalityController,
  getAllNationalityController,
  getOneNationalityController,
} from "./controller";
import { validateCountries } from "./validate";
const router = Router();

router.get("/nationality", authenticate, getAllNationalityController);
router.get("/nationality/:id", authenticate, getOneNationalityController);
router.put("/nationality/:id", authenticate, ediNationalityController);
router.get("/nationality-aggregation", authenticate, aggregationController);
router.post(
  "/nationality",
  validateCountries,
  authenticate,
  valResult,
  createNationalitysController,
);

export default router;
