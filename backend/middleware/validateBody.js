import createHttpError from 'http-errors';

export function validateBody(schema) {
  return async (req, res, next) => {
    if ((!req.body || Object.keys(req.body).length === 0) && !req.file) {
      return next(createHttpError(400, 'Request body cannot be empty'));
    }
    try {
      if (req.body && Object.keys(req.body).length > 0) {
        await schema.validateAsync(req.body, { abortEarly: false });
      }
      next();
    } catch (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      next(
        createHttpError(400, {
          message: 'Validation failed',
          errors,
        }),
      );
    }
  };
}
