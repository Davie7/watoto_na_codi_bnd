import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extended request interface to include authenticated user data
export interface AuthenticatedRequest extends Request {
  userId?: string;
  userType?: string;
}

// Authentication middleware
export const authenticate = async (
  req: AuthenticatedRequest,
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

    req.userId = user.id;
    req.userType = user.userType;

    next();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unauthorized - Invalid token';
    res.status(401).json({ success: false, error: message });
  }
};

// Authorization middleware based on roles
export const authorize = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.userType || !allowedRoles.includes(req.userType)) {
      res.status(403).json({ success: false, error: 'Forbidden - Insufficient permissions' });
      return;
    }

    next();
  };
};

// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { config } from '../config/env';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// // Extended request interface to include authenticated user data
// export interface AuthRequest extends Request {
//   userId?: string;
//   userType?: string;
// }

// // Authentication middleware
// export const authenticate = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       res.status(401).json({ success: false, error: 'Unauthorized - No token provided' });
//       return;
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, config.jwt.secret) as { id: string };

//     const user = await prisma.user.findUnique({
//       where: { id: decoded.id },
//     });

//     if (!user) {
//       res.status(401).json({ success: false, error: 'Unauthorized - Invalid token' });
//       return;
//     }

//     req.userId = user.id;
//     req.userType = user.userType;

//     next();
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : 'Unauthorized - Invalid token';
//     res.status(401).json({ success: false, error: message });
//   }
// };

// // Authorization middleware based on roles
// export const authorize = (allowedRoles: string[]) => {
//   return (req: AuthRequest, res: Response, next: NextFunction): void => {
//     if (!req.userType || !allowedRoles.includes(req.userType)) {
//       res.status(403).json({ success: false, error: 'Forbidden - Insufficient permissions' });
//       return;
//     }

//     next();
//   };
// };

