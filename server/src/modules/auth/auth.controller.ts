import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { RegisterInput, LoginInput } from './auth.schema';

/**
 * Authentication controller.
 * Handles HTTP request/response logic for auth endpoints.
 */
export class AuthController {
  /**
   * POST /api/auth/register
   * Registers a new user and returns user data with JWT token.
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: RegisterInput = req.body;
      const result = await authService.register(data);

      res.status(201).json({
        message: 'User registered successfully.',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Authenticates a user and returns user data with JWT token.
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: LoginInput = req.body;
      const result = await authService.login(data);

      res.status(200).json({
        message: 'Login successful.',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
