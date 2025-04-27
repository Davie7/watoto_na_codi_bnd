import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extended request interface to include authenticated user data
export interface AuthenticatedRequest extends Request {
  userId: string;
  userType: string;
}

// Authentication middleware
export const authenticate: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'Unauthorized - No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.status(401).json({ success: false, error: 'Unauthorized - Invalid token' });
      return;
    }

    // Add user info to request
    (req as AuthenticatedRequest).userId = user.id;
    (req as AuthenticatedRequest).userType = user.userType;

    next();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unauthorized - Invalid token';
    res.status(401).json({ success: false, error: message });
  }
};

// Authorization middleware based on roles
export const authorize = (allowedRoles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { userType } = req as AuthenticatedRequest;

    if (!userType || !allowedRoles.includes(userType)) {
      res.status(403).json({ success: false, error: 'Forbidden - Insufficient permissions' });
      return;
    }

    next();
  };
};


