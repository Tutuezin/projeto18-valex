import { Request, Response } from "express";
import { NumberSchema } from "joi";
import * as cardService from "../services/cardService";

export async function createCard(req: Request, res: Response) {
  const apiKey: any = req.headers["x-api-key"];
  const { employeeId, type }: { employeeId: number; type: string } = req.body;

  await cardService.createCard(Number(employeeId), type, apiKey);

  return res.status(201).send("card created");
}

export async function activateCard(req: Request, res: Response) {
  const { cardId } = req.params;
  const { securityCode, password }: { securityCode: string; password: string } =
    req.body;

  await cardService.activateCard(Number(cardId), securityCode, password);

  return res.status(200).send("card activated");
}
