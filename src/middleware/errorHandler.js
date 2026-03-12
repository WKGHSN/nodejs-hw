import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = createHttpError.isHttpError(err) ? err.status : 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ message });
};
