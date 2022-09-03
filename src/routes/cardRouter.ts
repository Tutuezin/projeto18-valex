import { Router } from "express";
import { validateSchema } from "../middlewares/validations/schemaValidator";
import * as cardController from "../controllers/cardController";
import validateApiKey from "../middlewares/validations/apiKeyValidator";
import { createCardSchema } from "../schemas/cardSchema";

const cardRouter = Router();

cardRouter.post(
  "/create-card",
  validateApiKey,
  validateSchema(createCardSchema),
  cardController.createCard
);

export default cardRouter;
