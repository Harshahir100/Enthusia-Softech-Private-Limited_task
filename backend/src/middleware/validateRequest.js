import { ApiError } from '../utils/ApiError.js';

export const validateBody = (validatorFn) => (req, res, next) => {
  const errors = validatorFn(req.body);
  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }
  next();
};