import { Router } from "express";
import { validateSchema } from "../middlewares/validations/schemaValidator";
import * as cardController from "../controllers/cardController";
import validateApiKey from "../middlewares/validations/apiKeyValidator";

const cardRouter = Router();

cardRouter.post("/card", validateApiKey, cardController.createCard);

export default cardRouter;
