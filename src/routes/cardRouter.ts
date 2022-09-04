import { Router } from "express";
import { validateSchema } from "../middlewares/validations/schemaValidator";
import * as cardController from "../controllers/cardController";
import validateApiKey from "../middlewares/validations/apiKeyValidator";
import {
  createCardSchema,
  activateCardSchema,
  passwordCardSchema,
} from "../schemas/cardSchema";

const cardRouter = Router();

cardRouter.post(
  "/card/create",
  validateApiKey,
  validateSchema(createCardSchema),
  cardController.createCard
);

cardRouter.post(
  "/card/activate/:cardId",
  validateSchema(activateCardSchema),
  cardController.activateCard
);

cardRouter.get("/card/balance/:cardId", cardController.balanceCard);

cardRouter.post(
  "/card/block/:cardId",
  validateSchema(passwordCardSchema),
  cardController.blockCard
);

cardRouter.post(
  "/card/unblock/:cardId",
  validateSchema(passwordCardSchema),
  cardController.unblockCard
);

//cardRouter.post("/card/payments/:cardId/:businessId");

export default cardRouter;
