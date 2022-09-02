import { Request, Response, NextFunction } from "express";
import { missingHeaderError } from "../errorMiddleware";

export default function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["x-api-key"];

  if (typeof apiKey !== "string" || !apiKey) {
    throw missingHeaderError("Header is missing");
  }

  next();
}
