import { Request, Response, NextFunction } from 'express';

import { inventoryService } from './inventory.service';

/**
 * Inventory controller.
 * Handles HTTP request/response logic for inventory
 * (purchase/restock) endpoints.
 */
export class InventoryController {

  /**
   * POST /api/vehicles/:id/purchase
   * Purchases a vehicle and creates a purchase history record.
   */
  async purchase(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {

    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized. User information not found.',
      });
      return;
    }

    const result = await inventoryService.purchaseVehicle(
      req.params.id as string,
      req.user.id
    );

    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
}

  /**
   * POST /api/vehicles/:id/restock
   * Restocks a vehicle (Admin only), increasing its quantity.
   */
  async restock(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { quantity } = req.body;

      const result = await inventoryService.restockVehicle(
        req.params.id as string,
        quantity
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const inventoryController = new InventoryController();