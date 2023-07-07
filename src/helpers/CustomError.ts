import { ValidationError } from 'express-validator';

interface ErrorData {
  [key: string]: any;
}

type ErrorTypes = ErrorData | ErrorData[] | ValidationError | ValidationError[];

class CustomError extends Error {
  statusCode: number;
  error: ErrorTypes | null;

  constructor(
    code: number,
    message: string,
    errorObj?: ErrorTypes
  ) {
    super(message);
    this.statusCode = code;
    this.error = errorObj || null;

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default CustomError;