import Joi from "joi";
import { EQUIPMENT_TYPES, VALID_CURRENCIES } from "../constants/constants.js";

export const flexibleDate = Joi.alternatives()
  .try(
    Joi.date().iso(),
    Joi.string()
      .trim()
      .pattern(/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/),
    Joi.string()
      .trim()
      .pattern(/^\d{4}\/\d{2}\/\d{2}( \d{2}:\d{2}:\d{2})?$/)
  )
  .custom((value, helpers) => {
    const d = new Date(value);
    if (isNaN(d.getTime())) return helpers.error("any.invalid");
    return value;
  });

export const createProductSchema = Joi.object({
  serialNumber: Joi.alternatives()
    .try(Joi.number().integer().min(0), Joi.string().trim().pattern(/^\d+$/))
    .required()
    .custom((value, helpers) => {
      return typeof value === "string" ? parseInt(value, 10) : value;
    }),

  isNew: Joi.alternatives()
    .try(Joi.number().valid(0, 1), Joi.boolean())
    .required(),

  photo: Joi.string().trim().allow(null, ""),
  title: Joi.string().trim().min(3).max(100).required(),

  type: Joi.string()
    .trim()
    .valid(...Object.values(EQUIPMENT_TYPES))
    .required()
    .messages({
      "any.only": "{#label} must be one of the allowed equipment types",
      "string.base": "{#label} must be a string",
      "any.required": "{#label} is required",
    }),

  specification: Joi.string().trim().min(5).max(300).required(),
  guarantee_start: flexibleDate.optional(),
  guarantee_end: flexibleDate.optional(),
  date: flexibleDate.required(),

  price: Joi.number()
    .precision(2)
    .positive()
    .required()
    .prefs({
      messages: {
        "number.base": "{#label} must be a number",
        "number.precision": "{#label} can have at most {#limit} decimal places",
        "number.positive": "{#label} must be positive",
        "any.required": "{#label} is required",
      },
    }),

  inputCurrency: Joi.string()
    .trim()
    .valid(...Object.values(VALID_CURRENCIES))
    .required()
    .messages({
      "any.only": "{#label} must be one of the allowed currencies: USD, UAH",
      "string.base": "{#label} must be a string",
      "any.required": "{#label} is required",
    }),
}).prefs({
  messages: {
    "any.required": "{#label} is required",
    "any.invalid": "{#label} is invalid",
  },
});
