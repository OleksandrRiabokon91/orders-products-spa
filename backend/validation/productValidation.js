import Joi from "joi";

export const productSchema = Joi.object({
  serialNumber: Joi.number().integer().required().messages({
    "number.base": "Serial number must be a number.",
    "number.integer": "Serial number must be an integer.",
    "any.required": "Serial number is required.",
  }),

  isNew: Joi.number().integer().valid(0, 1).required().messages({
    "number.base": "isNew must be 0 or 1.",
    "any.only": "isNew must be 0 or 1.",
    "any.required": "isNew is required.",
  }),

  photo: Joi.string().required().messages({
    "string.base": "Photo must be a string.",
    "any.required": "Photo is required.",
  }),

  title: Joi.string().min(1).max(255).required().messages({
    "string.min": "Title must contain at least 1 character.",
    "string.max": "Title must contain no more than 255 characters.",
    "any.required": "Title is required.",
  }),

  type: Joi.string().min(1).max(100).required().messages({
    "string.min": "Type must contain at least 1 character.",
    "string.max": "Type must contain no more than 100 characters.",
    "any.required": "Type is required.",
  }),

  specification: Joi.string().allow("").max(1000).messages({
    "string.max": "Specification must contain no more than 1000 characters.",
  }),

  guarantee_start: Joi.date().iso().required().messages({
    "date.format": "Guarantee start must be a valid ISO date.",
    "any.required": "Guarantee start is required.",
  }),

  guarantee_end: Joi.date().iso().required().messages({
    "date.format": "Guarantee end must be a valid ISO date.",
    "any.required": "Guarantee end is required.",
  }),

  price_usd: Joi.string()
    .pattern(/^\d+(\.\d{1,2})?$/)
    .required()
    .messages({
      "string.pattern.base":
        "Price USD must be a number with up to 2 decimal places.",
      "any.required": "Price USD is required.",
    }),
  price_uah: Joi.string()
    .pattern(/^\d+(\.\d{1,2})?$/)
    .required()
    .messages({
      "string.pattern.base":
        "Price UAH must be a number with up to 2 decimal places.",
      "any.required": "Price UAH is required.",
    }),

  date: Joi.date().iso().required().messages({
    "date.format": "Date must be a valid ISO date.",
    "any.required": "Date is required.",
  }),
});

export function validateProduct(req, res, next) {
  const { error } = productSchema.validate(req.body, {
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

// ! response
//  {
//             "id": 3,
//             "title": "Product 3",
//             "serialNumber": 1003,
//             "type": "Keyboards",
//             "specification": "Specification 3",
//             "isNew": 1,
//             "photo": "pathToFile.jpg",
//             "date": "2025-12-10T09:25:47.000Z",
//             "price": [
//                 {
//                     "value": "268.09",
//                     "symbol": "USD",
//                     "isDefault": 0
//                 },
//                 {
//                     "value": "12370.62",
//                     "symbol": "UAH",
//                     "isDefault": 1
//                 }
//             ],
//             "guarantee": {
//                 "product_id": 3,
//                 "start": "2025-12-10T09:25:47.000Z",
//                 "end": "2026-12-10T09:25:47.000Z"
//             }
//         }

// ! req
//                 {
//   "serialNumber": "1001",
//   "isNew": true,
//   "photo": "example-photo.jpg",
//   "title": "Monitor Samsung Odyssey",
//   "type": "Monitors",
//   "specification": "27 inch, 144Hz, IPS",
//   "guarantee_start": "2025-01-01 10:00:00",
//   "guarantee_end": "2026-01-01 10:00:00",
//   "date": "2025-01-10 12:00:00",
//   "price": 150,
//   "inputCurrency": "USD"
// }
// {
//   "serialNumber": 1001,
//   "isNew": 0,
//   "photo": "example-photo.jpg",
//   "title": "Monitor Samsung Odyssey",
//   "type": "Monitors",
//   "specification": "27 inch, 144Hz, IPS",
//   "guarantee_start": "2025-01-01 10:00:00",
//   "guarantee_end": "2026-01-01 10:00:00",
//   "date": "2025-01-10 12:00:00",
//   "price": 150,
//   "inputCurrency": "USD"
// }
