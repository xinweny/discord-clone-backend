import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (!err) {
    res.status(500).json({
      statusCode: 500,
      error: {},
      message: 'Internal Server Error',
    });
    return;
  }

  res.status(err.statusCode);

  res.json({
    statusCode: err.statusCode,
    error: err.error || {},
    message: err.message,
  });
};

export default errorHandler;