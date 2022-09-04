import { Router } from "express";
import * as paymentController from "../controllers/paymentController";
import validateApiKey from "../middlewares/validations/apiKeyValidator";
import { validateSchema } from "../middlewares/validations/schemaValidator";
import { amountCardSchema } from "../schemas/cardSchema";

const paymentRouter = Router();

paymentRouter.post("/card/payments/:cardId/:businessId");

export default paymentRouter;
