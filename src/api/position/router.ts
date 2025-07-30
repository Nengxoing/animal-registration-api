import Router from "express";

import { valResult } from "../../utils/validateResult";

import { authenticate } from "../../utils/jwt";
import {
  aggregationController,
  createPositionController,
  ediPositionController,
  getAllPositionController,
  getOnePositionController,
} from "./controller";

const router = Router();

router.get("/position", authenticate, getAllPositionController);
router.get("/position/:id", authenticate, getOnePositionController);
router.get("/position-aggregation", authenticate, aggregationController);
router.put("/position/:id", authenticate, ediPositionController);
router.post("/position", authenticate, valResult, createPositionController);

export default router;
