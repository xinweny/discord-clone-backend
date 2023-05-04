import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.statusCode);

  res.json({
    statusCode: err.statusCode || 500,
    error: err.error || {},
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;