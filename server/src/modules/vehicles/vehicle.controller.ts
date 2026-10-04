import { Request, Response, NextFunction } from "express";
import { vehicleService } from "./vehicle.service";

/**
 * Vehicle controller.
 * Handles HTTP request/response logic for vehicle endpoints.
 */
export class VehicleController {
  /**
   * POST /api/vehicles
   * Creates a new vehicle in the inventory.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.createVehicle(req.body);
      res.status(201).json({
        message: "Vehicle created successfully.",
        vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/vehicles
   * Returns all vehicles in the inventory.
   */
  async getAllVehicles(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = Math.max(parseInt(req.query.page as string) || 1, 1);

      const limit = Math.min(
        Math.max(parseInt(req.query.limit as string) || 5, 1),
        50,
      );

      const allowedSortFields = [
        "createdAt",
        "price",
        "quantity",
        "make",
      ] as const;

      const requestedSort = req.query.sortBy as string;

      const sortBy = allowedSortFields.includes(
        requestedSort as (typeof allowedSortFields)[number],
      )
        ? (requestedSort as (typeof allowedSortFields)[number])
        : "createdAt";

      const requestedOrder = req.query.order as string;

      const order =
        requestedOrder === "asc" || requestedOrder === "desc"
          ? requestedOrder
          : "desc";

      const result = await vehicleService.getAllVehicles(
        page,
        limit,
        sortBy,
        order,
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/vehicles/search
   * Searches vehicles by query parameters.
   */
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicles = await vehicleService.searchVehicles(req.query as any);
      res.status(200).json({ vehicles });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/vehicles/:id
   * Updates a vehicle's details.
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const vehicle = await vehicleService.updateVehicle(
        req.params.id as string,
        req.body,
      );
      res.status(200).json({
        message: "Vehicle updated successfully.",
        vehicle,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/vehicles/:id
   * Deletes a vehicle (Admin only).
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await vehicleService.deleteVehicle(
        req.params.id as string,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const vehicleController = new VehicleController();
