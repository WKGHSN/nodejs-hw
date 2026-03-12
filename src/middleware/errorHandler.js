import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let status = 500;
  let message = 'Internal Server Error';

  if (err instanceof HttpError) {
    status = err.status;
    message = err.message || err.name || 'Internal Server Error';
  }

  res.status(status).json({ message });
};
