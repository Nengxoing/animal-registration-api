import Router from "express";

import { createFinanceController, getAllFinanceController } from "./controller";

import { upload } from "../../utils/file-helper";
import { authenticate } from "../../utils/jwt";
import { valResult } from "../../utils/validateResult";

const router = Router();

router.post( "/finance", authenticate, upload("finance", true).single("receiptImage"), valResult, createFinanceController);
router.get("/finance", authenticate, getAllFinanceController);

export default router;

