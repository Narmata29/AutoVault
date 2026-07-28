import { Role } from '@prisma/client';

/**
 * Augments the Express Request interface to include
 * the authenticated user's information after JWT verification.
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
      };
    }
  }
}

export {};
