import { Response } from "express";

function errorHandler(err, req, res: Response, next) {
  res.sendStatus(500);
}

export default errorHandler;
