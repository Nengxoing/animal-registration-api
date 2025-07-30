import Router from "express";

import { valResult } from "../../utils/validateResult";

import { authenticate } from "../../utils/jwt";
import {
  aggregationController,
  createOfficeController,
  ediOfficeController,
  getAllOfficeController,
  getOfficeLogController,
  getOneOfficeController,
} from "./controller";
import { validateOffice } from "./validate";

const router = Router();

router.get("/office", getAllOfficeController);
router.get("/office-log", authenticate, getOfficeLogController);
router.get("/office/:id", getOneOfficeController);
router.put("/office/:id", authenticate, ediOfficeController);
router.get("/office-aggregation", aggregationController);
router.post(
  "/office",
  authenticate,
  validateOffice,
  valResult,
  createOfficeController,
);

export default router;
