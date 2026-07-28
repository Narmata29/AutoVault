import { Request, Response, NextFunction } from 'express';

/**
 * Admin-only authorization middleware.
 * Must be used AFTER the authenticate middleware.
 * Returns 403 if the authenticated user is not an admin.
 */
export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required.' });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    return;
  }

  next();
};
