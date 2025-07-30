import Router from "express";

import applicationRouter from "./api/application/router";
import authRouter from "./api/auth/router";
import backlistRouter from "./api/backlist/router";
import categoryRouter from "./api/category/router";
import companyRouter from "./api/company/router";
import currencyRouter from "./api/currency/router";
import districtRouter from "./api/district/router";
import exchangeRateRouter from "./api/exchange_rate/router";
import financeRouter from "./api/finance/router";
import folderRouter from "./api/folder/router";
import galleryRouter from "./api/gallery/router";
import countryRouter from "./api/nationality/router";
import numberRouter from "./api/number/router";
import officeRouter from "./api/office/router";
import positionRouter from "./api/position/router";
import priceRouter from "./api/price/router";
import profileRouter from "./api/profile/router";
import profileGalleryRouter from "./api/profileGallery/router";
import provinceRouter from "./api/province/router";
import refundRouter from "./api/refund/router";
import reportRouter from "./api/report/router";
import userRouter from "./api/user/router";
import villageRouter from "./api/village/router";

import {
  createLoginSwaggerController,
  swaggerLoginController,
} from "./swaggers/controller";

const router = Router();

router.use(applicationRouter);
router.use(companyRouter);
router.use(countryRouter);
router.use(districtRouter);
router.use(financeRouter);
router.use(folderRouter);
router.use(numberRouter);
router.use(officeRouter);
router.use(positionRouter);
router.use(priceRouter);
router.use(profileRouter);
router.use(provinceRouter);
router.use(userRouter);
router.use(authRouter);
router.use(backlistRouter);
router.use(reportRouter);
router.use(refundRouter);
router.use(villageRouter);
router.use(galleryRouter);
router.use(currencyRouter);
router.use(exchangeRateRouter);
router.use(profileGalleryRouter);
router.use(categoryRouter);

router.get("/swagger-login", createLoginSwaggerController);
router.post("/swagger-login", swaggerLoginController);

export default router;
