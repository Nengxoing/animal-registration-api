import Router from "express";
import { authenticate } from "../../utils/jwt";
import { valResult } from "../../utils/validateResult";
import { createExchangeRateController, deleteExchangeRateController, editExchangeRateController, getAggregationExchangeRateController, getAllExchangeRateController, getOneExchangeRateController } from "./controller";

const router = Router();

router.get("/exchange_rate", authenticate, getAllExchangeRateController);
router.get("/exchange_rate/:id", getOneExchangeRateController);
router.post("/exchange_rate", authenticate, valResult, createExchangeRateController);
router.put("/exchange_rate/:id", authenticate, valResult, editExchangeRateController);
router.delete("/exchange_rate/:id", authenticate, valResult, deleteExchangeRateController);
router.get("/exchange_rate-aggregation", authenticate, getAggregationExchangeRateController);

export default router;

