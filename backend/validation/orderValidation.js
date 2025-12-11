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

// пост примеры данных
// {
//   "title": "Order With Products",
//   "description": "Auto-created with products",
//   "date": "2025-12-10 12:00:00",
//   "products": [
//     {
//       "serialNumber": "1001",
//       "isNew": true,
//       "photo": "monitor-lg.jpg",
//       "title": "Monitor LG",
//       "type": "Monitors",
//       "specification": "IPS 27\", 144Hz",
//       "guarantee_start": "2025-01-01 10:00:00",
//       "guarantee_end": "2026-01-01 10:00:00",
//       "price": 150,
//       "inputCurrency": "UAH",
//       "date": "2025-01-10 12:00:00"
//     },
//     {
//       "serialNumber": "1002",
//       "isNew": false,
//       "photo": "keyboard-logitech.jpg",
//       "title": "Keyboard Logitech",
//       "type": "Keyboards",
//       "specification": "Mechanical Brown Switches",
//       "guarantee_start": "2024-03-01 14:00:00",
//       "guarantee_end": "2025-03-01 14:00:00",
//       "price": 80,
//       "inputCurrency": "UAH",
//       "date": "2025-01-10 12:00:00"
//     }
//   ]
// }
