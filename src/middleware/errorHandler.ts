import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500);

  res.json({
    statusCode: err.statusCode || 500,
    ...(err.error && { data: err.error }),
    message: err.message,
  });
};

export default errorHandler;