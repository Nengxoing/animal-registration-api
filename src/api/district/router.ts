import Router from "express";

import { valResult } from "../../utils/validateResult";

import { authenticate } from "../../utils/jwt";
import {
  aggregationController,
  createDistrictsController,
  ediDistrictController,
  getAllDistrictController,
  getOneDistrictController,
} from "./controller";

const router = Router();

router.get("/district", authenticate, getAllDistrictController);
router.get("/district/:id", authenticate, getOneDistrictController);
router.put("/district/:id", authenticate, ediDistrictController);
router.get("/district-aggregation", authenticate, aggregationController);
router.post("/district", authenticate, valResult, createDistrictsController);

export default router;
