import type { ErrorRequestHandler } from "express";
interface Error {
  type: string;
  message: string | string[];
}

export function unprocessableError(error: string[]): Error {
  return { type: "error_unprocessable_entity", message: error };
}

export function missingHeaderError(header: string): Error {
  return {
    type: "error_unauthorized",
    message: `${header}`,
  };
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.type === "error_unprocessable_entity") {
    return res.status(422).send(err.message);
  }

  if (err.type === "error_unauthorized") {
    return res.status(401).send(err.message);
  }
  return res.status(500).send(err.message);
};

export default errorHandler;
