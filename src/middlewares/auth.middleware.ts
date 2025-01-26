import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';
import { ApiError } from '../utils/api-error';

export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Unauthorized - No token provided');
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    next(new ApiError(401, 'Unauthorized - Invalid token'));
  }
};
