import { Router } from "express";
import { wishlistController } from "./wishlist.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.get(
  "/",
  authenticate,
  (req, res, next) => {
    wishlistController.getWishlist(req, res, next);
  },
);

router.post(
  "/",
  authenticate,
  (req, res, next) => {
    wishlistController.addToWishlist(req, res, next);
  },
);

router.delete(
  "/:vehicleId",
  authenticate,
  (req, res, next) => {
    wishlistController.removeFromWishlist(req, res, next);
  },
);

export default router;