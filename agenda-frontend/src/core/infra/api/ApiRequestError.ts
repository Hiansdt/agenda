export const INTERNAL_SERVER_ERROR_MESSAGE =
  "Ocorreu um erro interno. Tente novamente em instantes.";

export type ApiErrorResponse = Readonly<{
  error?: unknown;
  code?: unknown;
}>;

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}
