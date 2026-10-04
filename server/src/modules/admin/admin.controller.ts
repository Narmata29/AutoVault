import { Request, Response, NextFunction } from "express";
import { adminService } from "./admin.service";

export class AdminController {
  /**
   * GET /api/admin/analytics
   * Returns dealership analytics for admin users.
   */
  async getAnalytics(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const analytics = await adminService.getAnalytics();

      res.status(200).json({
        analytics,
      });
    } catch (error) {
      next(error);
    }
  }
  async getDemandInsights(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const insights = await adminService.getDemandInsights();

      res.status(200).json({
        insights,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
