import { Request, Response, NextFunction } from 'express';
import { purchaseService } from './purchase.service';

export class PurchaseController {

  /**
   * GET /api/purchases
   * Returns purchase history of the authenticated user.
   */
  async getMyPurchases(
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

      const purchases = await purchaseService.getMyPurchases(
        req.user.id
      );

      res.status(200).json({
        purchases,
      });

    } catch (error) {
      next(error);
    }
  }
}

export const purchaseController = new PurchaseController();