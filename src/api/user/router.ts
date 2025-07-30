import { Router } from "express";
import { userSchemaCreate } from "./validate";

import {
  createUserController,
  getAggregationUserController,
  getManyUserController,
  getOneUserController,
  updateUserEditAccountController,
} from "./controller";

import { authenticate } from "../../utils/jwt";
import { valResult } from "../../utils/validateResult";

const router = Router();

router.post("/user", authenticate, userSchemaCreate, valResult, createUserController);
router.get("/user", authenticate, getManyUserController);
router.get("/user/:id", authenticate, getOneUserController);
router.put("/user/:id", authenticate, valResult, updateUserEditAccountController);
router.get("/user-aggregation", authenticate, getAggregationUserController);

export default router;
