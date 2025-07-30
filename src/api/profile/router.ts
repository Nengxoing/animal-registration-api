import Router from "express";

import { uploadFiles } from "../../utils/file-helper";
import { authenticate } from "../../utils/jwt";
import { valResult } from "../../utils/validateResult";
import {
  checkProfileExistenceController,
  createProfileController,
  editProfileController,
  getAggregationChartProfileController,
  getAggregationProfileController,
  getAllProfileController,
  getOneProfileController,
  getProfileBarcodeController,
  getProfileLogController,
} from "./controller";

const router = Router();

router.get("/profile/:id", getOneProfileController);
router.post( "/profile", uploadFiles("profile", true, ["image", "oldImage"]), authenticate, valResult, createProfileController );
router.put("/profile/:id", authenticate, uploadFiles("profile", true, ["image", "oldImage"]), valResult, editProfileController);
router.get("/profile-log", authenticate, getProfileLogController);
router.get("/profile", getAllProfileController);
router.get("/profile-aggregation", getAggregationProfileController);
router.get("/profile-chart", getAggregationChartProfileController);
router.get("/profile-barcode", authenticate, getProfileBarcodeController);
router.post("/profile-check-existence", checkProfileExistenceController);

export default router;
