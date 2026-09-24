import { isValidObjectId } from '../utils/validators.js';
import { ApiError } from '../utils/ApiError.js';

export const validateObjectId = (paramName = 'id') => (req, res, next) => {
  const id = req.params[paramName];
  if (!isValidObjectId(id)) {
    return next(new ApiError(400, `Invalid ${paramName} format`));
  }
  next();
};