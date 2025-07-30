import Router from "express";

import { valResult } from "../../utils/validateResult";

import { upload } from "../../utils/file-helper";
import { authenticate } from "../../utils/jwt";
import {
  createApplicationController,
  ediApplicationController,
  getAggregationApplicationController,
  getAllApplicationController,
  getFoldersByCompanyIdController,
  getHistoryController,
  getLastOneController,
  getOneApplicationController,
  statusApplicationController,
  updateManyApplicationStatusController,
  uploadFileController,
} from "./controller";
import { validatorApplication } from "./validate";

const router = Router();

router.post("/application", authenticate, upload("application-file", true).array("applicationFile"), validatorApplication, valResult, createApplicationController);
router.get("/application", authenticate, getAllApplicationController);
router.patch("/application/:id/status", authenticate, statusApplicationController);
router.patch("/application/update-status", authenticate, updateManyApplicationStatusController);
router.get("/application/:id", authenticate, getOneApplicationController);
router.put("/application/:id", authenticate, upload("application-file", true).array("applicationFile"), ediApplicationController);
router.get("/application/history/:id", getHistoryController);
router.get("/application/last/:id", getLastOneController);
router.get("/application-aggregations", getAggregationApplicationController);
router.post("/application/file/:id", authenticate, upload("application-file", true).array("applicationFile"), uploadFileController);
router.get("/application/folders/:companyId", authenticate, getFoldersByCompanyIdController);

export default router;
