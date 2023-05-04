interface ErrorConstructor {
  new (message?: string): Error;
  (message?: string): Error;
  (code?: number): Error;
  readonly prototype: Error;
}

declare const Error: ErrorConstructor;

class Exception extends Error {
  constructor(message: string, code: number) {
    super(message);
    this.code = code;

    Object.setPrototypeOf(this, Exception.prototype);
  }
}

export default Exception;