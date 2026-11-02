export class AuthRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthRequestError";
  }
}

export function messageFor(error: unknown): string {
  if (error instanceof AuthRequestError) {
    return error.message;
  }
  if (error instanceof TypeError) {
    return "The server could not be reached.";
  }
  if (error instanceof SyntaxError) {
    return "The response could not be read.";
  }
  return "Something went wrong.";
}
