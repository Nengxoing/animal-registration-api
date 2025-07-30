import Router from "express";
import { authenticate } from "../../utils/jwt";
import { valResult } from "../../utils/validateResult";
import { createCurrencyController, deleteCurrencyController, editCurrencyController, getAggregationCurrencyController, getAllCurrencyController, getOneCurrencyController } from "./controller";

const router = Router();

router.get("/currency", authenticate, getAllCurrencyController);
router.get("/currency/:id", getOneCurrencyController);
router.post("/currency", authenticate, valResult, createCurrencyController);
router.put("/currency/:id", authenticate, valResult, editCurrencyController);
router.delete("/currency/:id", authenticate, valResult, deleteCurrencyController);
router.get("/currency-aggregation", authenticate, getAggregationCurrencyController);

export default router;

