import { Request, Response } from "express";

export async function createCard(req: Request, res: Response) {
  try {
    const apiKey = req.headers["x-api-key"];

    res.status(201).send("card created");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
