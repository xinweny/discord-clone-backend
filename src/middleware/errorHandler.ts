import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.statusCode);

  res.json({
    error: err.error,
    message: err.message,
  });
};

export default errorHandler;