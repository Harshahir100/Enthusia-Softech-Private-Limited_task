export const success = (res, statusCode, message, data = null, meta = null) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  if (meta !== null) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

export const failure = (res, statusCode, message, details = null) => {
  const payload = { success: false, message };
  if (details) payload.details = details;
  return res.status(statusCode).json(payload);
};