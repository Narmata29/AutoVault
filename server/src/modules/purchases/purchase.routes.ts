import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { purchaseController } from './purchase.controller';

const router = Router();

/**
 * GET /api/purchases
 * Get purchase history of the logged-in user.
 */
router.get(
  '/',
  authenticate,
  (req, res, next) => {
    purchaseController.getMyPurchases(req, res, next);
  }
);

export default router;