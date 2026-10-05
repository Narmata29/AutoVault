"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistController = exports.WishlistController = void 0;
const wishlist_service_1 = require("./wishlist.service");
class WishlistController {
    async addToWishlist(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const { vehicleId } = req.body;
            const wishlist = await wishlist_service_1.wishlistService.addToWishlist(req.user.id, vehicleId);
            res.status(201).json({
                message: "Vehicle added to wishlist",
                wishlist,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async removeFromWishlist(req, res, next) {
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
            const result = await wishlist_service_1.wishlistService.removeFromWishlist(req.user.id, vehicleId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async getWishlist(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }
            const wishlist = await wishlist_service_1.wishlistService.getWishlist(req.user.id);
            res.status(200).json({
                wishlist,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.WishlistController = WishlistController;
exports.wishlistController = new WishlistController();
