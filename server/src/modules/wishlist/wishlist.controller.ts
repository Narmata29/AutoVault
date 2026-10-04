import { Request, Response, NextFunction } from "express";
import { wishlistService } from "./wishlist.service";

export class WishlistController {
  async addToWishlist(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const { vehicleId } = req.body;

      const wishlist = await wishlistService.addToWishlist(
        req.user.id,
        vehicleId,
      );

      res.status(201).json({
        message: "Vehicle added to wishlist",
        wishlist,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeFromWishlist(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const vehicleId = req.params.vehicleId;

      if (typeof vehicleId !== "string" || vehicleId.length === 0) {
        res.status(400).json({ message: "Vehicle ID is required" });
        return;
      }

      const result = await wishlistService.removeFromWishlist(
        req.user.id,
        vehicleId,
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getWishlist(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const wishlist = await wishlistService.getWishlist(req.user.id);

      res.status(200).json({
        wishlist,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const wishlistController = new WishlistController();
