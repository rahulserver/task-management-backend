import { Response } from 'express';
import { IApiResponse, IErrorResponse } from '../interfaces/response.interface';

export abstract class BaseController {
  protected sendSuccess<T>(res: Response, data: T, message = 'Success'): void {
    const response: IApiResponse<T> = {
      success: true,
      data,
      message,
    };
    res.json(response);
  }

  protected sendError(
    res: Response,
    statusCode: number,
    message: string,
    errors?: any,
  ): void {
    const errorResponse: IErrorResponse = {
      success: false,
      message,
      errors,
      statusCode,
    };
    res.status(statusCode).json(errorResponse);
  }
}
