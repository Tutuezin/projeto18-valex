import { Request, Response, NextFunction } from "express";

export function validateSchema(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const messageError = error.details.map((item: any) => item.message);
      return res.status(422).send(messageError);
    }

    next();
  };
}
