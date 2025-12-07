import Joi from "joi";

export const orderSchema = Joi.object({
  title: Joi.string().min(1).max(255).required().messages({
    "string.min": "Title must contain at least 1 character.",
    "string.max": "Title must contain no more than 255 characters.",
    "any.required": "Title is required.",
  }),

  description: Joi.string().allow("").max(1000).messages({
    "string.max": "Description must contain no more than 1000 characters.",
  }),

  date: Joi.date().iso().required().messages({
    "date.format": "Date must be a valid ISO format.",
    "any.required": "Date is required.",
  }),
});

export function validateOrder(req, res, next) {
  const { error } = orderSchema.validate(req.body, {
    abortEarly: false,
    convert: true,
    stripUnknown: false,
  });

  if (error) {
    const errors = error.details.map((e) => e.message);
    return res.status(400).json({ errors });
  }

  next();
}
