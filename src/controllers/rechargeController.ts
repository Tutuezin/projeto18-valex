import { Request, Response } from "express";
import * as rechargeService from "../services/rechargeService";

export async function rechargeCard(req: Request, res: Response) {
  const apiKey: any = req.headers["x-api-key"];
  const { cardId } = req.params;
  const { amount }: { amount: number } = req.body;

  await rechargeService.rechargeCard(apiKey, Number(cardId), amount);

  return res.status(201).send("recharge done");
}
