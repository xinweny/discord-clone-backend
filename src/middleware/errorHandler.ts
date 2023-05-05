import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500);

  res.json({
    statusCode: err.statusCode || 500,
    error: err.error || err.stack || {},
    message: err.message,
  });
};

export default errorHandler;