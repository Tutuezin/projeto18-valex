import { Router } from "express";
import cardRouter from "./cardRouter";
import paymentRouter from "./paymentRouter";
import rechargeRouter from "./rechargeRouter";

const router = Router();

router.use(cardRouter);
router.use(rechargeRouter);
router.use(paymentRouter);

export default router;
