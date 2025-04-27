import { Request, Response } from 'express';
import { authService, RegisterUserDto, LoginUserDto, GoogleUserDto } from '../services/authService';
import { UserType } from '@prisma/client';

//  Define extended request interfaces
interface AuthenticatedRequest extends Request {
  userId: string;
}

export interface GoogleRequest extends Request {
  user: {
    email: string;
    id: string;
  };
}

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: RegisterUserDto = {
        email: req.body.email,
        password: req.body.password,
        userType: req.body.userType as UserType,
      };

      const { user, token } = await authService.register(userData);

      res.status(201).json({
        success: true,
        data: { user, token },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginUserDto = {
        email: req.body.email,
        password: req.body.password,
      };

      const { user, token } = await authService.login(loginData);

      res.status(200).json({
        success: true,
        data: { user, token },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async googleAuthCallback(req: GoogleRequest, res: Response): Promise<void> {
    try {
      const googleUser = req.user;

      if (!googleUser) {
        throw new Error('Google authentication failed');
      }

      const googleData: GoogleUserDto = {
        email: googleUser.email,
        googleId: googleUser.id,
        userType: req.body.userType as UserType,
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user: _user, token } = await authService.googleAuth(googleData);

      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const user = await authService.getUserById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  }
}

export const authController = new AuthController();



