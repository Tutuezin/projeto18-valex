import { Request, Response } from "express";
import * as cardService from "../services/cardService";

export async function createCard(req: Request, res: Response) {
  const apiKey: any = req.headers["x-api-key"];
  const { employeeId, type }: { employeeId: number; type: string } = req.body;

  await cardService.createCard(Number(employeeId), type, apiKey);

  return res.status(201).send("card created");
}
