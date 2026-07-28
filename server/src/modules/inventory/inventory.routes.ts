import { Router } from 'express';
import { inventoryController } from './inventory.controller';
import { authenticate } from '../../middleware/auth';
import { adminOnly } from '../../middleware/adminOnly';
import { validate } from '../../middleware/validate';
import { restockSchema } from './inventory.schema';

/**
 * Inventory routes — all endpoints require authentication.
 * POST /api/vehicles/:id/purchase - Purchase a vehicle (any authenticated user)
 * POST /api/vehicles/:id/restock  - Restock a vehicle (Admin only)
 */
const router = Router();

router.post('/:id/purchase', authenticate, (req, res, next) => {
  inventoryController.purchase(req, res, next);
});

router.post('/:id/restock', authenticate, adminOnly, validate(restockSchema), (req, res, next) => {
  inventoryController.restock(req, res, next);
});

export default router;
