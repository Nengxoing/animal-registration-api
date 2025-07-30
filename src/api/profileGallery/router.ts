import Router from "express";
import { authenticate } from "../../utils/jwt";
import { valResult } from "../../utils/validateResult";
import { createProfileGalleryController, deleteProfileGalleryController, editProfileGalleryController, getAllProfileGalleryController, getOneProfileGalleryController } from "./controller";

const router = Router();

router.get("/profile_gallery", authenticate, getAllProfileGalleryController);
router.get("/profile_gallery/:id", getOneProfileGalleryController);
router.post("/profile_gallery", authenticate, createProfileGalleryController);
router.put("/profile_gallery/:id", authenticate, editProfileGalleryController);
router.delete("/profile_gallery/:id", authenticate, valResult, deleteProfileGalleryController);

export default router;

