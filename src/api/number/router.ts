import Router from "express";
import { getAllNumberController, getNumberFolderAggregationController } from "./controller";

const router = Router();

router.get("/number", getAllNumberController);
router.get("/number-folder-aggregation", getNumberFolderAggregationController);

export default router;

