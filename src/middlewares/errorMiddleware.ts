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
    message: header,
  };
}

export function notFoundError(value: string): Error {
  return {
    type: "error_not_found",
    message: `Could not find specified ${value}`,
  };
}

export function conflictError(value: string): Error {
  return {
    type: "error_conflict",
    message: `The type ${value} already exists`,
  };
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.type === "error_unprocessable_entity") {
    return res.status(422).send(err.message);
  }

  if (err.type === "error_unauthorized") {
    return res.status(401).send(err.message);
  }

  if (err.type === "error_not_found") {
    return res.status(404).send(err.message);
  }

  if (err.type === "error_conflict") {
    return res.status(409).send(err.message);
  }

  return res.status(500).send(err.message);
};

export default errorHandler;
