import { Router } from "express";
import { valResult } from "../../utils/validateResult";

import { loginController } from "./controller";
import { valLogin } from "./validate";

const router = Router();

router.post("/login", valLogin, valResult, loginController);

export default router;
