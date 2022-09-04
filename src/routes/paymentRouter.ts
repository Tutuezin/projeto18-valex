import { Router } from "express";
import * as paymentController from "../controllers/paymentController";
import { validateSchema } from "../middlewares/validations/schemaValidator";
import { paymentSchema } from "../schemas/paymentSchema";

const paymentRouter = Router();

paymentRouter.post(
  "/card/payment/:cardId/:businessId",
  validateSchema(paymentSchema),
  paymentController.payment
);

export default paymentRouter;
