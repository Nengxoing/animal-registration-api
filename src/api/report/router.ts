import Router from "express";

import { getApplicationAggregationController, getApplicationStatisticsController } from "./application-aggregation";
import { getFinanceAggregationController } from "./finance";
import { getFolderRefundAggregationController } from "./folder-refund-aggregation";
import { getNumberAggregationController } from "./number";
import { getRevenueAggregationController, getTotalRevenueController } from "./total-revenue";

const router = Router();

router.get("/application-aggregation", getApplicationAggregationController);
router.get("/application-stats", getApplicationStatisticsController);
router.get("/total-revenue", getTotalRevenueController);
router.get("/revenue-aggregation", getRevenueAggregationController);
router.get("/folder-refund-aggregation", getFolderRefundAggregationController);
router.get("/finance-aggregation", getFinanceAggregationController);
router.get("/number-aggregation", getNumberAggregationController);

export default router;

