import Joi from "joi";
import { createProductSchema, flexibleDate } from "./productValidation.js";

export const createOrderSchema = Joi.object({
  title: Joi.string().min(3).max(255).required().messages({
    "string.base": "Title must be a string.",
    "string.min": "Title must contain at least {#limit} characters.",
    "string.max": "Title must contain no more than {#limit} characters.",
    "any.required": "Title is required.",
  }),

  description: Joi.string().allow("").max(1000).messages({
    "string.base": "Description must be a string.",
    "string.max": "Description must contain no more than 1000 characters.",
  }),

  date: flexibleDate.required().messages({
    "any.required": "Date of the order is required.",
    "any.invalid": "Date format is invalid. Use ISO or YYYY-MM-DD[ HH:mm:ss].",
  }),

  products: Joi.alternatives()
    .try(createProductSchema, Joi.array().items(createProductSchema))
    .optional()
    .messages({
      "alternatives.types":
        "Products must be either a single product object or an array of products.",
    }),
})
  .unknown(false)
  .prefs({
    messages: {
      "any.required": "{#label} is required.",
      "any.invalid": "{#label} is invalid.",
    },
  });
