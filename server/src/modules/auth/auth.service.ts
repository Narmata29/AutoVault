import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/prisma';
import env from '../../config/env';
import { AppError } from '../../middleware/errorHandler';
import { RegisterInput, LoginInput } from './auth.schema';
import { Role } from '@prisma/client';

/**
 * Authentication service.
 * Handles user registration and login business logic.
 */
export class AuthService {
  /**
   * Registers a new user.
   * Hashes the password, optionally grants admin role if valid admin secret is provided.
   * @returns The created user (without password) and a JWT token.
   * @throws AppError if email already exists.
   */
  async register(data: RegisterInput) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('A user with this email already exists.', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Determine role based on admin secret
    const role: Role = data.adminSecret === env.ADMIN_SECRET ? Role.ADMIN : Role.USER;

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role);

    return { user, token };
  }

  /**
   * Authenticates a user with email and password.
   * @returns The user (without password) and a JWT token.
   * @throws AppError if credentials are invalid.
   */
  async login(data: LoginInput) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password.', 401);
    }

    // Generate token
    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Generates a JWT token with user claims.
   */
  private generateToken(id: string, email: string, role: Role): string {
    return jwt.sign(
      { id, email, role },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
}

export const authService = new AuthService();
