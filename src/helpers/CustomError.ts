import { ValidationError } from 'express-validator';

interface ErrorData {
  [key: string]: string | number;
}

class CustomError extends Error {
  statusCode: number;
  error: ErrorData | ErrorData[] | ValidationError | ValidationError[];

  constructor(
    message: string,
    code: number,
    errorObj?: ErrorData | ErrorData[] | ValidationError | ValidationError[]
  ) {
    super(message);
    this.statusCode = code;
    this.error = errorObj || {};

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default CustomError;