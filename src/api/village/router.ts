import Router from "express";

import { valResult } from "../../utils/validateResult";

import { authenticate } from "../../utils/jwt";
import {
  aggregationController,
  createVillagesController,
  ediVillageController,
  getAllVillageController,
  getOneVillageController,
} from "./controller";

const router = Router();

router.get("/village", authenticate, getAllVillageController);
router.get("/village/:id", authenticate, getOneVillageController);
router.put("/village/:id", authenticate, ediVillageController);
router.get("/village-aggregation", authenticate, aggregationController);
router.post("/village", authenticate, valResult, createVillagesController);

export default router;
