/* eslint-disable @typescript-eslint/no-unused-vars */

import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

// Define UserType locally 
type UserType = 'STUDENT' | 'PARENT' | 'SCHOOL';

const prisma = new PrismaClient();

export interface RegisterUserDto {
  email: string;
  password: string;
  userType: UserType; 
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface GoogleUserDto {
  email: string;
  googleId: string;
  userType: UserType; 
}

export class AuthService {
  async register(userData: RegisterUserDto): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        userType: userData.userType,
      },
    });

    // Generate JWT token
    const token = this.generateToken(user.id);

    // Return user without password and token
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as User, token };
  }

  async login(loginData: LoginUserDto): Promise<{ user: User; token: string }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: loginData.email },
    });

    if (!user || !user.password) {
      throw new Error('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    // Return user without password and token
    const { password: _password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as User, token };
  }

  async googleAuth(googleData: GoogleUserDto): Promise<{ user: User; token: string }> {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: googleData.email },
    });

    if (user) {
      // Update Google ID if not set
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: googleData.googleId },
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: googleData.email,
          googleId: googleData.googleId,
          userType: googleData.userType,
        },
      });
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    // Return user and token
    return { user, token };
  }

  async getUserById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  private generateToken(userId: string): string {
    // @ts-expect-error - Bypassing TypeScript type checking for JWT sign method
    return jwt.sign({ id: userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  }
}

export const authService = new AuthService();


