import Router from "express";

import { upload } from "../../utils/file-helper";
import { valResult } from "../../utils/validateResult";

import { authenticate } from "../../utils/jwt";
import { createRefundController, getAllRefundController } from "./controller";
import validateRefund from "./validate";

const router = Router();

router.post("/refund", authenticate, upload("refund", true).array("refundImage"), validateRefund, valResult, createRefundController);
router.get("/refund", authenticate, getAllRefundController);

export default router;
