export interface IPaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface IErrorDetail {
  field?: string;
  message: string;
  code?: string;
}

export interface IErrorResponse {
  success: false;
  message: string;
  errors?: IErrorDetail[];
  statusCode: number;
}
