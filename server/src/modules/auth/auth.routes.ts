import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema } from './auth.schema';

/**
 * Authentication routes.
 * POST /api/auth/register - Register a new user
 * POST /api/auth/login    - Login and receive JWT token
 */
const router = Router();

router.post('/register', validate(registerSchema), (req, res, next) => {
  authController.register(req, res, next);
});

router.post('/login', validate(loginSchema), (req, res, next) => {
  authController.login(req, res, next);
});

export default router;
