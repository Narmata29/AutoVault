import { Request, Response, NextFunction } from 'express';
import { inventoryService } from './inventory.service';

/**
 * Inventory controller.
 * Handles HTTP request/response logic for inventory (purchase/restock) endpoints.
 */
export class InventoryController {
  /**
   * POST /api/vehicles/:id/purchase
   * Purchases a vehicle, decreasing its quantity by 1.
   */
  async purchase(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await inventoryService.purchaseVehicle(req.params.id as string);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/vehicles/:id/restock
   * Restocks a vehicle (Admin only), increasing its quantity.
   */
  async restock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quantity } = req.body;
      const result = await inventoryService.restockVehicle(req.params.id as string, quantity);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const inventoryController = new InventoryController();
