import Joi from "joi";

export const amountCardSchema = Joi.object({
  amount: Joi.number().min(1).required(),
});
