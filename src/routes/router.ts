import { Router } from "express";
import cardRouter from "./cardRouter";
import rechargeRouter from "./rechargeRouter";

const router = Router();

router.use(cardRouter);
router.use(rechargeRouter);

export default router;
