import { Router } from 'express';
import { vehicleController } from './vehicle.controller';
import { authenticate } from '../../middleware/auth';
import { adminOnly } from '../../middleware/adminOnly';
import { validate } from '../../middleware/validate';
import { createVehicleSchema, updateVehicleSchema, searchVehicleSchema } from './vehicle.schema';

/**
 * Vehicle routes — all endpoints require authentication.
 * POST   /api/vehicles        - Add a new vehicle
 * GET    /api/vehicles        - List all vehicles
 * GET    /api/vehicles/search - Search vehicles
 * PUT    /api/vehicles/:id    - Update a vehicle
 * DELETE /api/vehicles/:id    - Delete a vehicle (Admin only)
 */
const router = Router();

// Search must be defined before :id to avoid treating "search" as an ID
router.get('/search', authenticate, validate(searchVehicleSchema, 'query'), (req, res, next) => {
  vehicleController.search(req, res, next);
});

router.get('/', authenticate, (req, res, next) => {
  vehicleController.getAll(req, res, next);
});

router.post('/', authenticate, validate(createVehicleSchema), (req, res, next) => {
  vehicleController.create(req, res, next);
});

router.put('/:id', authenticate, validate(updateVehicleSchema), (req, res, next) => {
  vehicleController.update(req, res, next);
});

router.delete('/:id', authenticate, adminOnly, (req, res, next) => {
  vehicleController.delete(req, res, next);
});

export default router;
