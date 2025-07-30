import Router from "express";
import { authenticate } from "../../utils/jwt";
import { valResult } from "../../utils/validateResult";
import {
  createAnimalExportController,
  createFolderController,
  createFolderRejectController,
  editFolderController,
  getAggregationFolderController,
  getAllAnimalExportController,
  getAllFolderController,
  getFolderLogController,
  getOneFolderController,
  statusFolderController,
} from "./controller";
import { validateCreateFolder } from "./validate";

const router = Router();

router.get("/folder/animal-exports", authenticate, getAllAnimalExportController);
router.get("/folder", getAllFolderController);
router.get("  ", authenticate, getFolderLogController);
router.get("/folder/:id", authenticate, getOneFolderController);
router.put("/folder/:id", authenticate, editFolderController);
router.patch("/folder/:id/progress", authenticate, statusFolderController);
router.post("/folder-reject", authenticate, createFolderRejectController);
router.get("/folder-aggregation", authenticate, getAggregationFolderController);
router.post(
  "/folder",
  authenticate,
  validateCreateFolder,
  valResult,
  createFolderController,
);;

router.post("/folder/export-animal", authenticate, createAnimalExportController);

export default router;

