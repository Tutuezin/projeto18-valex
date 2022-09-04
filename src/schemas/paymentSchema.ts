import Joi from "joi";

export const paymentSchema = Joi.object({
  password: Joi.string()
    .regex(/^[0-9]*$/)
    .length(4)
    .required(),
  amount: Joi.number().min(1).required(),
});
