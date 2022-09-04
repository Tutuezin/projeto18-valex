import { Router } from "express";
import * as rechargeController from "../controllers/rechargeController";
import validateApiKey from "../middlewares/validations/apiKeyValidator";
import { validateSchema } from "../middlewares/validations/schemaValidator";
import { amountCardSchema } from "../schemas/rechargeSchema";

const rechargeRouter = Router();

rechargeRouter.post(
  "/card/recharge/:cardId",
  validateApiKey,
  validateSchema(amountCardSchema),
  rechargeController.rechargeCard
);

export default rechargeRouter;
