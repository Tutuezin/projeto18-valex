import { Request, Response } from "express";
import * as cardService from "../services/cardService";

export async function createCard(req: Request, res: Response) {
  const apiKey: any = req.headers["x-api-key"];
  const { employeeId, type }: { employeeId: number; type: string } = req.body;

  const clientCard: any = await cardService.createCard(
    Number(employeeId),
    type,
    apiKey
  );

  return res.status(201).send(clientCard); /*   */
}

export async function activateCard(req: Request, res: Response) {
  const { cardId } = req.params;
  const { securityCode, password }: { securityCode: string; password: string } =
    req.body;

  await cardService.activateCard(Number(cardId), securityCode, password);

  return res.status(200).send("card activated");
}

export async function balanceCard(req: Request, res: Response) {
  const { cardId } = req.params;

  const balanceAndTransactions = await cardService.balanceCard(Number(cardId));

  return res.status(200).send(balanceAndTransactions);
}

export async function blockCard(req: Request, res: Response) {
  const { cardId } = req.params;
  const { password }: { password: string } = req.body;

  await cardService.blockCard(Number(cardId), password);

  return res.status(200).send("card was blocked");
}

export async function unblockCard(req: Request, res: Response) {
  const { cardId } = req.params;
  const { password }: { password: string } = req.body;

  await cardService.unblockCard(Number(cardId), password);

  return res.status(200).send("card was unblocked");
}
