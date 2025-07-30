import Router from "express";

import { valResult } from "../../utils/validateResult";

import { authenticate } from "../../utils/jwt";
import {
  createPriceController,
  ediPriceController,
  getAllPriceController,
  getOnePriceController,
  getPriceLogController,
} from "./controller";
import validatePrice from "./validate";

const router = Router();

router.get("/price", authenticate, getAllPriceController);
router.get("/price-log", authenticate, getPriceLogController);
router.get("/price/:id", authenticate, getOnePriceController);
router.put("/price/:id", authenticate, ediPriceController);
router.post("/price", authenticate, validatePrice, valResult, createPriceController);

export default router;
