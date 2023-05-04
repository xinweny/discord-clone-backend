interface ErrorData {
  [key: string]: string | number;
}

class CustomError extends Error {
  statusCode: number;
  error: ErrorData[] | ErrorData;

  constructor(message: string, code: number, errorObj?: ErrorData){
    super(message);
    this.statusCode = code;
    this.error = errorObj || {};

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default CustomError;