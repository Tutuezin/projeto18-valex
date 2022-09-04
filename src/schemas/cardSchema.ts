import Joi from "joi";

export const createCardSchema = Joi.object({
  employeeId: Joi.number().required(),
  type: Joi.string()
    .valid("groceries", "restaurant", "transport", "education", "health")
    .required(),
});

export const activateCardSchema = Joi.object({
  password: Joi.string()
    .regex(/^[0-9]*$/)
    .length(4)
    .required(),
  securityCode: Joi.string()
    .regex(/^[0-9]*$/)
    .length(3)
    .required(),
});
