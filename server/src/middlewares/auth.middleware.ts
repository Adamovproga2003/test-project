import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export interface verifiedRequest extends Request {
  userId?: string;
}

export function verifyToken(
  req: verifiedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: 'Access denied' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid token' });
  }
}
