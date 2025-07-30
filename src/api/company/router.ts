/* eslint-disable linebreak-style */
import Router from "express";

import { upload } from "../../utils/file-helper";
import { authenticate } from "../../utils/jwt";
import { valResult } from "../../utils/validateResult";
import {
  aggregationController,
  createCompanyController,
  ediCompanyController,
  getAllCompanyController,
  getBusinessTypeController,
  getCompanyLogController,
  getOneCompanyController,
} from "./controller";

const router = Router();

router.get("/company", getAllCompanyController);
router.get("/company-log", authenticate, getCompanyLogController);
router.get("/company/:id", getOneCompanyController);
router.get("/company-aggregation", aggregationController);
router.get("/businesstype", getBusinessTypeController);
router.post(
  "/company",
  authenticate,
  upload("company", true).array("companyFile"),
  valResult,
  createCompanyController,
);
router.put(
  "/company/:id",
  authenticate,
  upload("company", true).array("companyFile"),
  valResult,
  ediCompanyController,
);

export default router;
