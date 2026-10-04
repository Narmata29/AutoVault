import { Router } from 'express';

import { adminController } from './admin.controller';

import { authenticate } from '../../middleware/auth';

import { adminOnly } from '../../middleware/adminOnly';

const router = Router();

/**
 * GET /api/admin/analytics
 * Admin-only dealership analytics.
 */
router.get(
  '/analytics',
  authenticate,
  adminOnly,
  (req, res, next) => {
    adminController.getAnalytics(req, res, next);
  }
);

router.get('/demand-insights', authenticate, adminOnly, (req, res, next) => {
  adminController.getDemandInsights(req, res, next);
});

export default router;