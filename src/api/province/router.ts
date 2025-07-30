import Router from "express";

import { valResult } from "../../utils/validateResult";

import { authenticate } from "../../utils/jwt";
import {
  aggregationController,
  createProvincesController,
  ediProvinceController,
  getAllProvinceController,
  getOneProvinceController,
} from "./controller";

const router = Router();

router.get("/province", authenticate, getAllProvinceController);
router.get("/province/:id", authenticate, getOneProvinceController);
router.put("/province/:id", authenticate, ediProvinceController);
router.get("/province-aggregation", authenticate, aggregationController);
router.post("/province", authenticate, valResult, createProvincesController);

export default router;
