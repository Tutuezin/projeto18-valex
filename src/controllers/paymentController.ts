import { Request, Response } from "express";
import * as paymentService from "../services/paymentService";

export async function payment(req: Request, res: Response) {
  const { cardId, businessId } = req.params;
  const { amount, password }: { amount: number; password: string } = req.body;

  await paymentService.payment(
    Number(cardId),
    Number(businessId),
    password,
    amount
  );

  return res.status(201).send("payment done");
}
