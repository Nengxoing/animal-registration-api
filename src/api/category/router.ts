import Router from "express";
import { authenticate } from "../../utils/jwt";
import { createCategoryController, getAllCategoryController } from "./controller";

const router = Router();

router.get("/category", authenticate, getAllCategoryController);
router.post("/category", authenticate, createCategoryController);

export default router;