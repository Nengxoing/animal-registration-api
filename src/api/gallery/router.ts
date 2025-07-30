import Router from "express";
import { uploadFiles } from "../../utils/file-helper";
import { authenticate } from "../../utils/jwt";
import { valResult } from "../../utils/validateResult";
import { createGalleryController, deleteGalleryController, editGalleryController, getAggregationGalleryController, getAllGalleryController, getOneGalleryController } from "./controller";

const router = Router();

router.get("/gallery", authenticate, getAllGalleryController);
router.get("/gallery/:id", getOneGalleryController);
router.post("/gallery", authenticate, uploadFiles("gallery", true, ["image"]), valResult, createGalleryController);
router.put("/gallery/:id", authenticate, uploadFiles("gallery", true, ["image"]), valResult, editGalleryController);
router.delete("/gallery/:id", authenticate, valResult, deleteGalleryController);
router.get("/gallery-aggregation", authenticate, getAggregationGalleryController);

export default router;

