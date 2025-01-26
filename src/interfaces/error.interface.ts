export interface IErrorResponse {
  success: false;
  error: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
