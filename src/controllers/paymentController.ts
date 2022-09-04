import { Request, Response } from "express";
import * as paymentService from "../services/paymentService";

export async function payment(req: Request, res: Response) {
  const apiKey: any = req.headers["x-api-key"];
  const { cardId } = req.params;
  const { amount }: { amount: number } = req.body;

  await paymentService.payment();

  return res.status(201).send("recharge done");
}
