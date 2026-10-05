"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wishlist_controller_1 = require("./wishlist.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, (req, res, next) => {
    wishlist_controller_1.wishlistController.getWishlist(req, res, next);
});
router.post("/", auth_1.authenticate, (req, res, next) => {
    wishlist_controller_1.wishlistController.addToWishlist(req, res, next);
});
router.delete("/:vehicleId", auth_1.authenticate, (req, res, next) => {
    wishlist_controller_1.wishlistController.removeFromWishlist(req, res, next);
});
exports.default = router;
